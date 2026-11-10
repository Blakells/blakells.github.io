---
title: Enforcing an AI agent's dry run inside the browser
description: Why a prompt that says "don't submit" is not enough, and the guard, hook and audit that make Preflight's dry runs hold.
date: 2026-11-10
---

## A prompt is a request

A dry run in Preflight is meant to do the whole job except one thing: it fills the entire application
and stops before the click that sends it. The prompt tells the agent not to submit, which keeps it
from fighting a control it cannot use. But an instruction in a prompt is a request, not a guarantee.
The agent can misread a button, a page can change under it, and a form can submit itself.

So the stop is enforced in the page, not only requested in the prompt: enforce, then instruct. The
guard blocks the ways an agent submits a form, and the prompt explains the rule so the agent does not
fight it.

## The guard

`src/preflight/apply/helpers/dry_run_guard.js` is not a helper the agent calls. In a dry run the
launcher adds it to the browser driver as a second init script, so it runs in every page and frame,
cross-origin frames included, in the page's own world and before the page's scripts.

The guard reads the form's step markers with the same parser the agent's page reader uses.
`src/preflight/apply/helpers/lib/step_markers.js` is inlined at render time into both the agent's
`page_state.js` and the guard, so the two cannot disagree about which step is final. On the final step the guard blocks the submit whether it comes
from a click, a call to `form.submit()` or a call to `requestSubmit()`, while Next and Save & Continue
pass on earlier steps. One piece of it, the override of the native submit path:

```js
// src/preflight/apply/helpers/dry_run_guard.js
  proto.submit = function submit() {
    const step = read();
    const { v, el } = scriptVerdict(this, stateOf(step), isGeneric(step));
    if (v) return banner(v, el ? labelOf(el) : 'form.submit', el || this);
    return nativeSubmit.call(this);
  };
```

<figure>
  <img src="/images/preflight/guard-banner.png" alt="A test application form for a Data Analyst role, filled in for the fictional applicant Jordan Rivera, with a red banner across the top reading: PREFLIGHT DRY RUN: final Submit blocked (Submit)." width="1800" height="520" loading="lazy" />
  <figcaption>The guard blocking a final Submit on one of Preflight's own test pages.</figcaption>
</figure>

A refusal shows a red alert banner at the top of the page, which the agent sees in its next snapshot.
"Final Submit blocked" means the application's submit was refused; "action held" means one action was
refused and the walk can continue. The block is kept per frame and the agent's stop rule reads it, so
the browser and the agent never disagree about which button is final. The guard fails closed: an unreadable page reads as unknown, which errs toward holding the
submit, and a frame with a form but no active guard stops the run at once.

## Closing the side door

The guard patches the page's main world, but the browser driver runs its JavaScript tools in an
isolated world, where a native `form.submit()` would never meet the guard. So in a dry run the agent
may run no JavaScript of its own.

`src/preflight/apply/dry_run_hook.py` is a Claude Code `PreToolUse` hook installed for the run on
`browser_evaluate` and `browser_run_code_unsafe`. `browser_run_code_unsafe` may run a helper file by
name, `{"filename": "<helper>.js"}`, with no code at all. `browser_evaluate` may only hand a helper
its arguments, `() => { window.__apArgs = <JSON object or list> }`, with no `ref` and no `element`.
Any other function, any code, and any new filename is refused. A refusal exits 2 and its stderr text
goes back to the agent as the reason. Any error inside the hook also denies, because a broken hook
would otherwise let the call through.

The allow-list is every helper rendered for the run, except the init script, the guard and the init
page, plus the three CAPTCHA injects and `account_fill.js`. The launcher tests the hook before every
dry run, on a call it must deny and on a filename it must allow. This is where helpers over
improvisation pays: the complex widgets are versioned scripts with tests, and an allow-list only
works when the agent's code is known in advance.

## The gap, and what catches it

The guard intercepts clicks, keypresses and form submissions. It does not intercept network requests.
A page whose own script sends the application with `fetch` or `XMLHttpRequest` is not stopped in the
page, and I would rather say that plainly than imply the guard is total.

Two checks exist for what slips through. The confirmation backstop reads every tool result during a
run for the words an ATS uses once an application is in. Text alone is not enough, so it counts a
confirmation only after a submit-like action and ignores conditional phrasing, a question, a draft
notice, or another tab. A page that still shows a form with a step button is not a confirmation. A
confirmation seen during a dry run means the run submitted, whatever the agent's verdict says. The
launcher records it as applied in a dry run and marks the job `needs_review` with the note "submitted
during dry run", permanently, so a person can check what happened.

## A second opinion

The guard and the hook stop the agent. The auditor notices when a filled form is wrong. After the
agent ends with `RESULT:DRY_RUN`, while its Chrome is still open, the launcher runs a separate process
over CDP. It snapshots every frame of the page the agent stopped on: labels, values, selected options,
files, required flags, validation messages, buttons and progress markers. It adds the applicant facts,
references, confirmed answers, the tailored resume and cover letter, the job fields and the policy
text, then runs deterministic checks before it asks the LLM.

Those checks catch things a model might wave through, such as a value typed with two hyphens in a row
or a major that is not the applicant's. Only then does the LLM say whether the filled
form is accurate and still ready for a final action, with its issues and evidence. The run is
verified only when both are true and no submission confirmation is visible. The verdict is written
beside the run in `final-audit.json`. The audit is on by default; `APPLY_DRY_RUN_AUDIT=0` turns it
off, and with it off the guard and the hook still apply.

## What I'd tell someone building an agent

Enforce the rule in code, because a prompt is advice and a page can do almost anything. Explain the
same rule in the prompt anyway, so the agent works with the guard instead of fighting it. Then say
plainly where the enforcement stops, and put a second, independent check on the other side.
