# CLAUDE.md

## Purpose

This repository is an RPG game codebase.

Claude Code should treat this project as a system it is actively learning over time, not one it fully understands at the start of any given run.

Assume each run is stateless.

Do not rely on prior session memory.

Use this file and repository documentation as the source of persistent project context.

---

## Session Startup Rules

At the start of every session:

1. Read this file first.
2. Read the main README and any relevant docs for the subsystem being changed.
3. Identify the feature, subsystem, or workflow involved.
4. Inspect existing local patterns before editing.
5. Prefer minimal, targeted changes.

Always run from the `rpg/` directory where this file exists (`projects/site/rpg/`).

---

## Core Operating Principles

- Treat the codebase as partially unknown until verified.
- Do not assume unusual code is wrong.
- First determine whether behavior reflects:
  - gameplay rules
  - game balance decisions
  - event sequencing requirements
  - save/load constraints
  - rendering/UI flow
  - content/data conventions
  - integration or legacy constraints
- When uncertain, gather more context before changing shared logic.

---

## RPG-Specific Guidance

Expect domain-specific concerns such as:
- game state management
- player and NPC state transitions
- combat or rules logic
- inventory/equipment systems
- quest or progression systems
- event triggers and sequencing
- save/load persistence
- data-driven content definitions
- UI/gameplay separation

Preserve gameplay consistency.

Do not make balance, progression, or rules changes unless the task clearly requires it.

---

## Scope Control

- Only modify files directly related to the task.
- Do not refactor unrelated code.
- Prefer the smallest change that correctly solves the problem.
- Do not rewrite working systems just to make them cleaner.
- If a larger refactor seems necessary, first verify that the current task truly requires it.

---

## Code Organization Rules

- Prefer small, focused, single-responsibility files.
- Avoid growing "god files."
- If a file is accumulating multiple responsibilities, split it into smaller modules.
- Separate concerns where practical:
  - gameplay logic
  - UI/presentation
  - data/content definitions
  - infrastructure/utilities
- When adding a major new concern, prefer a new module instead of expanding an unrelated file.

---

## Change Safety Rules

Before changing code:
- inspect nearby files and calling code
- understand inputs, outputs, and side effects
- check whether the behavior affects shared systems
- look for tests, fixtures, scripts, or usage examples

After changing code:
- run relevant tests if available
- update or add tests when appropriate
- verify that related systems are not obviously broken
- check for edge cases introduced by the change

If no tests exist, reason explicitly about likely side effects.

---

## Documentation as Persistent Memory

Use documentation to preserve important knowledge across runs.

When you discover non-obvious project knowledge, update the most appropriate place:
- `CLAUDE.md` for repo-wide rules and durable conventions
- README files for usage or subsystem overview
- architecture or feature docs for system behavior
- comments near code for local implementation nuance

Do not rely on transient context when durable documentation would help future work.

---

## What to Document

Document only high-value information such as:
- why something is implemented a certain way
- non-obvious constraints
- edge cases
- game-rule or progression requirements
- subsystem boundaries
- integration quirks
- conventions that future contributors could easily miss

Do not restate obvious code.

Do not add speculative documentation.

Only document things that are:
- directly observed in code
- confirmed by existing docs
- required by the task
- or clearly established by surrounding implementation

When uncertain, do not promote a guess into documentation.

---

## Feedback Loop Rules

When a task reveals important repo knowledge:
1. Capture durable knowledge in docs.
2. Keep the update concise and factual.
3. Place the knowledge in the narrowest correct location.
4. Do not add broad repo-wide rules based on a single local pattern unless clearly justified.
5. Prefer updating subsystem docs before adding global rules.
6. If the change reveals a repeated pattern, document it so future sessions do not need to rediscover it.

---

## Consistency Rules

- Follow existing naming, structure, and style unless there is a strong reason not to.
- Preserve established project conventions.
- Avoid unnecessary churn in formatting or file structure.
- Keep diffs easy to review.

---

## Decision Rules for Documentation Updates

Update `CLAUDE.md` only for:
- repo-wide operating rules
- cross-cutting architectural conventions
- persistent contributor guidance
- patterns that apply broadly across the project

Update local docs or comments for:
- subsystem-specific behavior
- file-specific caveats
- tricky logic
- local constraints

---

## Entry Point Discipline

Before exploring widely, identify the most likely entry points for the task:
- relevant feature module
- state manager
- system handler
- UI screen/component
- data definition file
- save/load logic
- event dispatcher
- tests covering the behavior

Avoid unnecessary deep traversal of unrelated directories.

---

## Preferred Outcome

The goal is not only to complete the current task, but to leave the codebase easier to understand for future sessions and future contributors.

Improve code carefully.

Improve documentation deliberately.

Preserve project intent.
