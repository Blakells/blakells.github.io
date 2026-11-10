"""Screenshot Preflight's dry-run guard blocking a final Submit on its own test fixture page.

Run with Preflight's virtualenv:
    python tools/preflight_guard_shot.py <preflight-repo> <out.png>
Uses only the repo's fixtures and its fictional example applicant; nothing leaves 127.0.0.1.
"""
import json
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory

from playwright.sync_api import sync_playwright
from preflight.apply import helper_files


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main(repo: Path, out: Path) -> None:
    profile = json.loads((repo / "profile.example.json").read_text(encoding="utf-8"))
    with TemporaryDirectory() as tmp:
        helper_files.render_helpers(Path(tmp), ctx=helper_files.job_context(profile))
        guard = Path(tmp) / "dry_run_guard.js"
        handler = partial(QuietHandler, directory=str(repo / "tests" / "fixtures" / "guard"))
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                context = browser.new_context(viewport={"width": 900, "height": 260}, device_scale_factor=2)
                context.add_init_script(path=str(guard))
                page = context.new_page()
                page.goto(f"http://127.0.0.1:{server.server_address[1]}/plain-submit.html")
                page.click("#final-submit")
                page.wait_for_selector("[data-preflight-guard]")
                banner = page.locator("[data-preflight-guard]").inner_text()
                if "final Submit blocked" not in banner:
                    raise SystemExit(f"unexpected banner: {banner!r}")
                page.screenshot(path=str(out))
                browser.close()
        finally:
            server.shutdown()
    print(f"wrote {out}: {banner}")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
