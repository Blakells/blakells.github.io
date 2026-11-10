---
title: Testing an agent that must never submit
description: How Preflight's test suite proves its dry-run guard works, with a fake LLM, real Chromium and requests that never arrive.
date: 2026-11-10
---

## "Never submits" has to be proven

A dry run promises something narrow and important: the agent will fill the whole application and stop
before the final submit. That promise is easy to state and easy to get wrong. A click could land on
the wrong button, a page's own script could send the form, or a guard could quietly stop working
after a refactor. If nobody checks, "never submits" is a hope.

So the tests treat it as a property to prove. They run the guard in headless Chromium against local
pages and check, by the requests the server receives, that the final submit never arrives while the
allowed steps do. The evidence is not a log line saying the guard thinks it blocked something. It is
the absence of the request a submission would have made.

## Offline by design

The suite has 805 tests and runs in under 30 seconds, with no network, no API key and no real browser
profile. A fake OpenAI-compatible server stands in for the model, answering each prompt with fixed
text built from the fictional applicant Jordan Rivera. It records every request, and a test can
replace its reply to get a different answer.

The test bootstrap keeps all of that away from a real install. Every test runs against a throwaway
data folder, never `~/.preflight`, and the bootstrap deletes any `LLM_`, `ANTHROPIC_`, `APPLY_` or
`CLAUDE_CODE_` variable it inherited, along with the provider keys, so a developer's shell cannot leak
a provider, a key or a mode into a test run. A guard that passes because the machine happened to have
the right API key is not a test of the guard.

## Proving a request never arrives

The guard tests serve their fixture pages from a local server that records every non-HTML request:
method, path and body. Each scenario runs twice. The first pass uses a control context with no guard,
which shows the page really would submit. The second uses a context built from the rendered
`dry_run_guard.js`, and the same click must reach the server in the control and must not reach it with
the guard.

The plain form case makes the shape clear. In the control context, Next posts to `/next`, Save &
Continue posts to `/save-continue`, and the final Submit posts to `/apply`. The test clears the
server's record, opens the guarded context, clicks the final Submit, and waits. Then comes the
assertion that matters:

```python
# tests/test_dry_run_guard.py
    with _page(chromium, guard_script, guard_server, page_name, guarded=True) as page:
        page.click(button)
        page.wait_for_timeout(250)
        assert not _received(guard_server, "POST", "/apply")
```

The guard has recorded a final block with the right label and state, and the banner reads
"PREFLIGHT DRY RUN: final Submit blocked (Submit)". Then the test clicks Next and Save & Continue and
checks that both requests do arrive. Blocking everything would not pass this test either. The control
half is what makes the guarded half meaningful: the same page, the same click, and only the guard
changes the outcome.

The suite applies the same pattern to the other ways a form submits. A page whose script calls
`form.submit()`, a bare `requestSubmit()`, and a `requestSubmit()` aimed at a submit control are all
run in an unguarded context first, where they post, and then with the guard, where they do not. It
also covers a Workday-style final step, a non-final step whose Save and Continue must still reach the
server, a generic review page where Next is itself the final submit, account sign-in and verification
forms, and a consent modal whose Confirm passes while the application submission after it is held.

## Testing the hook

`tests/test_dry_run_hook.py` covers the other side of the same promise. It checks that a helper file
on the allow-list may run, that a `browser_run_code_unsafe` call carrying any inline code is refused,
and that an unknown or pathed filename is refused. It also checks that the `window.__apArgs` literal
hand-off is allowed, that `browser_evaluate` code which clicks or submits is refused, and that a
malformed payload fails closed with exit 2. The tests exercise both the decision function and the
hook's real subprocess entry point.

## What CI taught me

The first CI run failed, and the reason was not the code under test. GitHub Actions asks Rich for
color, so the CLI help text carried color codes that the local run never showed, and the help test
missed the command names it was looking for on every CI runner. The fix strips the escape sequences
before matching, which is the kind of bug that only shows up when the test runs somewhere other than
the machine it was written on. CI now runs the suite on Linux from Python 3.11 to 3.13, and on macOS.

## What the tests don't cover

Live submissions are left out on purpose. Nothing in CI and nothing in the test suite submits an
application. The tests prove that the guard refuses the final submit, and they prove it without
sending an application anywhere, which is the only way I want that property tested.
