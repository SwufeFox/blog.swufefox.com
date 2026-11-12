---
title: "Agent over Tools: Make the Tool a Protocol"
description: "WorldQuantUser's CLI is not a script for humans to read; it is a contract an agent can execute: one JSON document per call, enumerable failures, resumable state, and an explicit policy boundary."
date: 2026-11-13
category: Engineering
tags:
  - Agent
  - CLI
  - Automation
  - Quant research
---

Wiring an agent into a project usually means handing it a shell and a README, then hoping it figures things out. That works in a demo. Over dozens of rounds, the same problems surface: it re-guesses flags every session, parses logs meant for humans, and hunts for causes inside prose errors. One refactor invalidates everything it remembered.

[WorldQuantUser](https://github.com/SwufeFox/WorldQuantUser) is an alpha-research toolkit for WorldQuant BRAIN: generate FASTEXPR expressions, simulate batches, and read back the results. It does the opposite. It does not ask the agent to read the source. It asks every tool to state, in one JSON document, what it did, why it failed, and what can be done next. The README writes the constraint as one sentence: **a program should be able to drive the whole loop without reading the source.** That is what this post means by agent over tools: the agent decides above the tools; the tools provide stable semantics below it. The relationship is not “usage”; it is a contract.

## One call, one JSON document

An agent's worst outcome is not an error. It is something that looks like success. So the first contract is: stdout is exactly one JSON document, success or failure; progress goes to stderr and never contaminates the result.

```python
import json
import subprocess

def call(*args):
    proc = subprocess.run(
        ["python", "research_cli.py", *args],
        capture_output=True,
        text=True,
    )
    result = json.loads(proc.stdout)
    if not result["ok"]:
        error = result["error"]
        raise RuntimeError(f'{error["code"]}: {error["message"]}')
    return result
```

The point is not that the code is short. It is that the caller never has to understand an error message. Failure envelopes carry a stable `error.code`, a caller-facing `hint`, and optional `error.details`; a lint failure, for example, lists every finding per expression, so the caller does not have to regex the message.

Exit codes carry semantics too: `2` input, `3` auth, `4` service or rate limit, `5` not found, `6` every simulation failed, `7` submission refused by the policy lock, `130` interrupted. `7` exists so the caller can distinguish “policy says no” from “the service broke”: the first should stop asking, the second may retry.

Two more details exist for automation:

- No interactive prompts. Authentication failures raise `MissingCredentials`, `AuthError`, or `CaptchaRequired` directly. For an automated caller, a program waiting for input is not a slow request; it is a hang.
- `--save PATH` atomically writes the same JSON envelope as stdout, including failures. `--stream` emits progress as JSON Lines on stderr while stdout remains one document. A long run can be observed without breaking the contract.

## The tool describes itself

An agent should not learn the interface by reading `research_cli.py`. Help and schema are generated from the live argument declarations, so command binding and documentation share one source. There is no second truth where the docs say `--foo` and the code says `--bar`.

```bash
python research_cli.py help                    # command map, only when needed
python research_cli.py help catalog fields     # one task's options and examples
python research_cli.py schema probe            # one command's machine contract
```

The layering is deliberate: the full `schema` is for tooling integrations, not routine startup; `help` is opened only when the next command is unknown. An agent's context is a budget, not free memory. The repo's `AGENTS.md` says it plainly: do not read the entry point to learn the interface; take the minimum information the current stage needs.

| Stage | What it needs | Entry point |
| --- | --- | --- |
| Start | current state, evidence summary, source paths | `brief` |
| Discover | which commands exist for this step | `help` |
| Execute | arguments, defaults, examples | `help <command>` |
| Integrate | stable machine contract | `schema <command>` |
| Resume | where the last run stopped, which jobs were accepted | `resume <checkpoint>` |

Tool count is itself a context cost. The repo deleted superseded macro subsystems, one-shot migration scripts, and duplicate entry points, keeping only what would be asked a second time. Before adding an entry point, answer: which existing tool is closest, and why can't it take one more flag or subcommand? For an agent, fewer entry points mean a sharper contract and fewer wrong choices.

`brief` is the most important piece of this routing. It compresses the current research state into one bounded document: recent score leads, setbacks, open questions, ledger paths, and which files exist but are empty. It clips long previews at 240 characters and says plainly that a conclusion must be read from the source. That is cheaper than grepping the research directory every round, and more honest.

## Fast because failure is cheap

“Rapid iteration” is usually read as fast execution. What sets the speed of a loop is something else: **what one failure costs**. Simulation quota, network waits, rate-limit retries, and timeouts halfway through all cost far more than model generation.

WorldQuantUser puts most failures before the expensive action:

| Failure | Caught by | Cost |
| --- | --- | --- |
| Wrong field name | `catalog verify`, `simulate` preflight | 0 simulations |
| Unit mismatch | `lint`, `field-audit` | 0 simulations |
| Malformed request | `--dry-run` | 0 simulations, no credentials |
| Timeout mid-run | checkpoint / `resume` | no duplicate accepted simulations |
| Re-testing a ruled-out direction | `ledger list`, `brief` | 0 simulations |
| Refetching catalog metadata | metadata cache with TTL | 0 requests |

`probe --dry-run` is the extreme version: it loads no session, reads no credentials, contacts no catalog, spends no quota, yet validates every settings group, resolves defaults and per-arm decay, and returns the exact `POST /simulations` payload. The cheapest step already answers “what will this batch send?” A real probe then re-validates locally before login and submission, and uses the same catalog guard to reject unknown field names.

This is not hypothetical. A concrete lesson from the repo: `cap + abs(liabilities)` was refused because market cap carries `Unit[CSPrice:1,CSShare:1]` while liabilities are dimensionless in this catalog; the same shape appeared in three expressions of the same batch. `lint` now reports `unit_mismatch` first and says to divide by a common scale instead of adding. Deeper still, `probe_units` does not guess: it adds the field to a pure number, reads the unit out of the simulator's own rejection, and caches the answer. The next time, the question costs no simulation.

The same applies to timeouts. A simulation command has a five-minute wall-clock budget by default; if a server `Retry-After` would exceed it, the command returns `PENDING` instead of sleeping past the four-hour session cache. Accepted jobs and unsubmitted expressions are written atomically to a checkpoint; `resume` polls accepted jobs before submitting queued work, so recovery does not duplicate simulations. For an agent, failure is usually a resumable state, not the end of a round.

## Memory cannot live in the conversation

An agent's context ends; the research does not. Keep conclusions in the chat and the next round rereads everything. Put them in comments beside the source and research data leaks into version history. The repo separates the two: code in git; results, caches, one-off scripts and the ledger in a research directory; a `research/` inside the repo is git-ignored as a guard rail.

The ledger is append-only JSONL, one alpha per line: expression, full settings, in-sample metrics, platform checks, the idea it belongs to, a verdict, and a note. It answers offline:

```bash
python research_cli.py ledger list --field anl4_cfo_number
python research_cli.py ledger list --mechanism revision --verdict rejected
```

`already_tested: true` does not mean “do not try”; it means “read the prior verdict and metrics first.” Verdicts are not all failure states: `rejected` means the expression underperformed under those settings; `falsified` means a pre-registered hypothesis was tested against controls and lost; `no_go` means data or execution blocked a fair test. Keeping `falsified` separate from `rejected` tells a later round that the mechanism was ruled out, not merely that one spelling scored badly.

Cross-session questions live in `open-threads.md`, one line each: `- [open] **question** — evidence; next discriminating check`. Each round updates only the lines affected by evidence; detailed derivations stay in linked records. To borrow the wording of `AGENTS.md`, carry forward decisions, not the conversation.

## The loop

Wire the pieces together and one iteration is a short chain:

```mermaid title="One automatic iteration" note="Every step is a CLI call; every return value is the same JSON envelope."
flowchart LR
  A[brief] --> B[hypothesis and control]
  B --> C[lint / field-audit]
  C --> D[dry-run]
  D --> E[simulate / probe]
  E --> F[compare / ablate / self-check]
  F --> G[ledger / open-threads]
  G --> A
```

The command sequence is just as short:

```bash
python research_cli.py brief
python research_cli.py probe spec.json --dry-run
python research_cli.py probe spec.json
python research_cli.py compare results.json --contributions
python research_cli.py ledger record P0Mq0wEM \
  --idea "leverage, size-bucketed" \
  --verdict candidate \
  --note "why it mattered"
python research_cli.py brief
```

Each step depends only on the previous JSON and the current command's schema, not on hidden session state. When `brief` opens again, the agent gets evidence and source paths, not the previous chat. That is why “fully automatic” can persist: the loop's inputs and outputs are on disk, not in the context window.

## Automatic is not unbounded

The most copyable part may not be JSON. It is the restraint around “automatic.”

Submission is the only irreversible platform action, so it defaults to a dry run: `alpha submit ID` runs live checks and sends nothing; only `--yes` writes. The repo also requires `.env` or the environment to contain exactly `ALLOW_AGENT_SUBMIT=true`. Every other spelling — `1`, `yes`, `TRUE`, `on` — leaves the lock closed. Whitespace is forgiven; ambiguity is not. Ambiguity resolves to no.

The result is not a boolean. `submitted` is true only for `CONFIRMED`; the other states must be treated differently:

| `submission` | Meaning |
| --- | --- |
| `CONFIRMED` | `dateSubmitted` is set; it is in the book |
| `ACCEPTED` | the platform took the request, but it is not a submission yet; re-check |
| `REJECTED` | refused, with `failed_checks` naming the item and its value |
| `UNCERTAIN` | the read-back failed; the outcome is unknown |
| `NOT_SENT` | dry run, nothing was written |

This is not over-engineering. An earlier version treated any HTTP status below 400 as a successful submission and reported twenty submissions that were still `UNSUBMITTED`. For an automated system, an optimistic boolean is more dangerous than an explicit `UNCERTAIN`.

Experiment design has boundaries too. A controlled batch of arms in `probe` must contain exactly one `control`; a batch with no control must declare `design: "explore"` at the spec's top level. This is not ceremony; it is attribution. A subtraction experiment without a valid control can show “worse” but not where the difference came from. A scan and an experiment look identical in the ledger; the only difference is that a scan admits it is a scan.

Finally, `lint` is not a correctness proof. It catches unknown operators, arity, field names and units; it cannot know that a syntactically valid expression is economically meaningless. Automation should not remove judgement. It should turn judgement into executable refusal, so a human only has to look at what was not refused.

## Put the agent above the tools

Agent over tools is not “give the agent more tools,” and it is not “teach the agent to read the source.” It is an interface discipline:

- Tools describe their own interface instead of requiring the caller to understand the implementation.
- Every call returns a parseable result; failures have stable categories.
- Expensive actions are preceded by cheap preflight; failures are resumable.
- Conclusions go to durable storage, not the conversation.
- Irreversible actions have an explicit lock and distinguishable outcomes.

With these, an agent can keep the same loop across rounds instead of relearning the project each time. The model can change, the prompt can change, the implementation can be refactored; as long as the contract survives, the loop survives.

WorldQuantUser's README states the goal plainly: a program should be able to drive the whole loop without reading the source. That sentence is also an acceptance test for any “agent tool.” If a fresh process cannot do it, the thing is not an agent's tool. It is a script for humans with an agent wrapper.

The next iteration starts from `brief`, not from opening the source.

— Magixyne, 2026-11-13
