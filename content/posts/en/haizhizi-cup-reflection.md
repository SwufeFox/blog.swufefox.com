---
title: "Getting the Carbon Numbers to Add Up: Reflections on the Haizhizi Cup"
description: "From a green-building carbon ledger to a submitted product: notes on AI, evidence chains, and what a student team learned by making a demo auditable."
date: 2026-11-13
category: Reflection
tags:
  - Haizhizi Cup
  - Green building
  - AI agents
  - Competition
---

After the competition ended, I opened the repository again. The last stretch of commits was almost entirely fixes: PDF parsing, the D1 migration, Cloudflare builds, aligning reports with input snapshots. That was the moment the project felt like something another person could open, not a demo that only ran on our laptops.

We called it the Green Building Carbon Ledger. The name is plain, almost clumsy. But it says what I wanted to build: not a beautiful carbon number for a building, but a record of where every number came from, what it assumed, and which version it belonged to, so someone later can check it, change it, and stand behind it.

The code and documentation live in [this repository](https://github.com/SwufeFox/Green-Building-Carbon-Ledger-AICampus-cohl); the competition site is [here](https://aicampus.3311csci.com/).

## Why a ledger

The first Haizhizi Cup was hosted by China State Construction International and supported by the Xuexi Qiangguo platform. Its theme was “build good homes for the people, seek happiness for workers.” That sentence led us to building carbon. It is not an abstraction; it sits in every ton of steel, every truck of concrete, every kilometre of transport, every kilowatt-hour of operation. The problem is that those numbers live in Excel files, design notes, energy models, and drawings from different disciplines. Putting them together takes days, and once they are together, nobody can say which page a number came from.

AI is very good at making that faster. It can read design notes, pull materials from a bill of quantities, and find envelope and thermal parameters in gbXML, epJSON, or DXF. But we quickly learned that generating a plausible number is the easy part. The hard part is making the number traceable.

> If an AI gives you a number and cannot say where it came from, it has only traded the uncertainty of a spreadsheet for the uncertainty of a chat box.

So what we built is closer to a ledger: projects, candidate schemes, parameter revisions with evidence, trial and confirmed runs, and reports bound to input snapshots. The model can extract and infer, but every value has to say whether it came from a document, a user, a model inference, or a baseline default. An inference must be labelled as an inference. Unconfirmed inputs can only run a `trial`; `confirmed` waits until every input that actually enters the calculation has been confirmed. A historical report does not change when a later parameter changes; it stays anchored to the revision and factor version it was generated with.

This is not distrust of AI. It is putting AI where it can be responsible.

## Where AI should stand

The competition asked for an agent, not a calculator with a chat window. It took us a long time to make that real.

The agent can call the workbench's real APIs: create a project, read a scheme, compare completed runs. It cannot fake a successful run, quietly start a calculation, or change a parameter while the user only asked why the number went down. Tool calls must leave real execution results; if something fails, they return the reason. The interface must distinguish document extraction, user input, model inference, and baseline defaults. Four different kinds of knowledge cannot look the same.

We also kept a sentence that sounds like a wet blanket: confirming an input only means the user confirmed the parameters used in the calculation. It is not an engineer's review, third-party certification, or regulatory approval.

That sentence is not flattering, but it has to be there. Building carbon assessment eventually faces engineering, standards, and liability, not a polished conversation. AI can make the preparation before judgement thinner: it can turn documents in different formats into structured input, and shorten “where did this number come from” to one click. It cannot take the judgement away from the person.

That was the most important lesson of the competition: the hard part of an AI product is not model capability. It is the boundary of collaboration. The agent has to know when to act, when to stop, and when to hand the decision back.

## The invisible engineering

The competition lasted only a few months. The time did not go into drawing the interface. It went into making the thing calculate on someone else's machine.

Next.js on the front end; an independent Python worker for the calculation core; a strict input contract shared by both; a queue protected by leases; runs that can recover after failure; SQLite locally, D1 on Cloudflare; file parsing with limits on size, archive entries, memory, and time, so a malicious archive cannot take the service down. None of this makes a good poster. All of it decides whether the project can live outside a demo video.

The last stretch of commit messages is full of `harden`, `fix`, and `deploy`. None of them would make a screenshot. Each of them answered the same question: if someone else clones this repository, can they actually run it?

That was another lesson: completeness is not the length of the feature list. It is whether someone else can open it, reproduce it, and trust it.

## If I only remember three things

First, build the evidence chain before the interface. A carbon number without a source is decoration, however good the dashboard looks.

Second, the value of AI is not replacing judgement. It is making the work before judgement cheaper. It reads faster and organizes more than I can, but the final “is this parameter right?” still belongs to a person.

Third, open source does not end when the code is pushed. The README, the `AGENTS.md`, the migrations, the tests, the preview page — even the ugly security boundaries and the unverified paths — are part of the work. Saying clearly what is not done does not make the project weaker. It makes it more credible. The repository is MIT-licensed. It is not a zip file for judges to open once; it is something someone else can take, change, and continue.

## Thanks

Thanks to China State Construction International and the Xuexi Qiangguo platform for giving a group of students a chance to put AI into a real construction setting. Thanks to the judges and industry experts: your review made us realize that a carbon ledger is not only a technical artifact; it has to face engineering, standards, and responsibility.

Thanks to my teammates at Team SwufeFox. The people still fixing parsers, adding migrations, and staring at build logs at the end are the real authors of this work. Thanks also to everyone in the SwufeFox community who took a look and asked a question.

Thanks to the other teams. The same brief never has only one answer; you made that concrete.

Finally, thanks to the people who maintain Next.js, React, Python, and the countless small tools underneath. We stood on them, which left us free to think about the real problem.

## The ledger is not closed

After the competition, I opened the repository again. The first commit and the last commit are a little more than two months apart.

Two months cannot finish everything. Multi-user authentication for a real deployment, factor libraries for more regions, templates for more building types, a full human review flow — all still ahead. Some boundaries exist only in documentation. None of that is a neat ending.

But at least we left behind a ledger that can be continued.

If someone else has to do a building carbon assessment next time, I hope they do not have to start from a blank spreadsheet, or from an AI answer no one can trace. They can start from a project, a revision, and a report with sources, and keep writing.

That is probably what participating means: not proving how good we were, but pushing a real problem a little further.

The ledger is not closed, but every entry has a source.

— Magixyne, 2026-11-13
