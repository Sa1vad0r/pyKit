# Planning Room Architecture

This document describes the target design for the **Planning Room** (`/workspace`): an in-browser pygame IDE with built-in git, a student-led ticket board, and a teacher dashboard, all packaged as an open-source app that teachers can host themselves.

> **Status:** planning. Today `/workspace` is a UI mock rendering placeholder data from `app/workspace/data/mock.ts`. See [ROADMAP.md](ROADMAP.md) for the build order.

---

## Contents

- [Goals](#goals)
- [Who it's for](#who-its-for)
- [Constraints](#constraints)
- [How it fits with the heist levels](#how-it-fits-with-the-heist-levels)
- [System overview](#system-overview)
- [Modules](#modules)
  - [Runtime: running pygame](#runtime-running-pygame)
  - [Editor and file system](#editor-and-file-system)
  - [Assets: pixel editor and sound board](#assets-pixel-editor-and-sound-board)
  - [Git](#git)
  - [Tickets](#tickets)
  - [Progress and unlocking](#progress-and-unlocking)
  - [Auth and roles](#auth-and-roles)
- [Data model](#data-model)
- [Hosting and deployment](#hosting-and-deployment)
- [Teacher customization](#teacher-customization)
- [Documentation](#documentation)
- [Folder structure](#folder-structure)
- [Decisions](#decisions)
- [Open risks](#open-risks)

---

## Goals

1. **No setup for students.** Write, run, and share a multi-file pygame project with only a browser: no Python install, no git install, no GitHub account, no Jira.
2. **Real skills.** Students use real git (with real git wording), real Python files, and a real kanban workflow, so what they learn carries over to professional tools.
3. **Focus on structure and logic.** Limit assets to a built-in pixel editor and a curated sound board, so class time goes to code organization, teamwork, and problem solving.
4. **Free to run.** A teacher with no budget and an old computer can host a whole class.
5. **Teachers can customize it** without editing code.

## Who it's for

- **Students:** about 9th grade (ages 14–15). Many don't have a good computer of their own. Assume **shared, school-owned, low-end devices** such as 4 GB Chromebooks, lab PCs, and library computers, often on filtered or unreliable networks.
- **Teachers:** semi-technical. Comfortable following a written guide and running a command, but probably unfamiliar with Node, Next.js, or databases.

## Constraints

| Constraint | Consequence |
|---|---|
| Low-end hardware | The client must be light. Python is loaded once per session and cached per device. Heavy screens load only when opened. |
| Shared devices | The server holds the real copy of all work. Browser storage is only a cache and is cleared on logout. |
| Unreliable network | Commits work offline and push later. The Python runtime is served from our own copy and cached by a service worker. |
| School content filters | Never depend on third-party CDNs at runtime. |
| No budget | One Node process plus SQLite must be enough. No paid services required. |
| Student privacy (FERPA) | Minimal personal data: username and display name, no email required. Data stays on the school's or teacher's own server. |

## How it fits with the heist levels

The heist levels are the **intro roadmap**: they teach Python basics to beginners. After a student finishes the core levels, the Planning Room unlocks, and class moves to team projects: project structure, git, tickets, organization.

- The unlock rule can be configured (for example, "after level 4"), and a teacher can unlock it manually for any student.
- Future "pygame skills" modules (drawing sprites, animation, input handling) plug into the same roadmap.
- This requires level progress to move from `localStorage` to the server (see [Progress and unlocking](#progress-and-unlocking)).

## System overview

The core idea: **the browser does almost all the work.** Python, pygame, git operations, and diffs run on the student's device. The server only stores accounts, tickets, progress, and git data, so it stays small and cheap.

```
┌─────────────────────────── Browser (student device) ───────────────────────────┐
│                                                                                 │
│  Editor (CodeMirror)   File tree / tabs   Pixel editor   Sound board            │
│         │                     │                │              │                 │
│         └──────────── Virtual FS (LightningFS → IndexedDB cache) ───────────┐   │
│                                     │                                       │   │
│                    isomorphic-git (commit, branch, merge, diff, log)        │   │
│                                     │                                       │   │
│        Game iframe (sandboxed): Pyodide + pygame-ce, kept alive per session ◄┘   │
│                                     │                                            │
└─────────────────────────────────────┼────────────────────────────────────────────┘
                                      │  HTTPS (JSON + binary git objects)
┌─────────────────────────────────────┼──────── Server (Next.js, one process) ────┐
│   Auth / classes / roles     Git sync API (objects + refs)     Tickets   Progress │
│                                     │                                            │
│                      Drizzle ORM → SQLite (default) or Postgres                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

There is **no real-time server**. Teammates collaborate only through git (commit → push → pull → merge), like a real repo. Because nothing needs WebSockets, the app can run on serverless hosts as well as on one machine.

## Modules

Each module is a feature folder under `modules/`. Teachers can turn optional modules on or off.

### Runtime: running pygame

- **Engine:** Pyodide with the **pygame-ce** package. Always loaded from our own copy in `public/pyodide/`, never a CDN.
- **Isolation:** games run in a **sandboxed iframe** rather than a Web Worker, because SDL's browser build expects a real page with a canvas. The iframe also keeps keyboard focus simple and makes **Stop** reliable.
- **Kept loaded:** starting Python takes seconds on a low-end Chromebook, so one iframe stays loaded for the whole session. Between runs, the runtime resets only the student's own modules and globals. The iframe is destroyed and recreated only if a game freezes.
- **Background loading:** Python starts loading when the workspace opens, not when the student presses Run.
- **Caching:** a service worker caches the Python runtime (10 MB+) so each device downloads it once.
- **The game loop:** browsers can't run a blocking `while running:` loop. Before running, the student's code is **rewritten automatically** so that each frame yields to the browser (for example, an `await asyncio.sleep(0)` after `clock.tick()` / `pygame.display.flip()`). Students write normal pygame code, the same as in any tutorial.
- **Files:** before each run, the project's virtual file system is mounted into Pyodide's file system, so `import game.player` and `pygame.image.load("assets/sprites/player.png")` work as they do on a desktop.
- **Errors:** Python tracebacks are shown in the console, mapped back to the student's file and line, with beginner-friendly explanations for common errors.
- **Sound:** uses `pygame.mixer` if it works in the browser. Otherwise, a small Python module plays sound-board sounds through Web Audio (see [Open risks](#open-risks)).

### Editor and file system

- **Editor:** CodeMirror 6 (already in the project). Lighter than Monaco, which matters on weak devices. Adds tabs, a file tree, Python syntax checking, and a diff view (`@codemirror/merge`).
- **File system:** LightningFS on top of IndexedDB, shared by the editor, isomorphic-git, and the runtime.
- **Shared devices:** on login, the client downloads the team's repo from the server (student repos are small). On logout, local data is wiped. If the student has commits that aren't pushed, the editor warns them clearly before logout or session timeout.
- **Phones and tablets:** the editor targets keyboard devices. The ticket board and git history must work on phones, so students without a computer at home can still follow their team.

### Assets: pixel editor and sound board

Both save **real files into the repo**. Assets are versioned with git like any other file, and pygame loads them normally.

- **Pixel editor:**
  - Fixed canvas sizes (16×16, 32×32, 64×64), a palette, pencil, eraser, and fill tools.
  - **Frames** export as a sprite sheet, to support animation lessons.
  - Saves PNGs to `assets/sprites/`.
- **Sound board:**
  - A curated pack of CC0 sounds (for example, Kenney's packs) shipped in `content/sounds/`.
  - Teachers can add their own.
  - Picking a sound copies it into `assets/sounds/`.
- **Image conflicts:** binary files can't be merged line by line. When two teammates change the same PNG, the conflict screen shows both images side by side with **Keep mine / Keep theirs**.

### Git

**Client:** isomorphic-git does all real git work in the browser: staging, commits, branches, merges, diffs, logs.

**Server:** a small **sync API** instead of the git network protocol. Git objects and refs are stored in the database, so no git binary or permanent disk is needed:

| Endpoint | Purpose |
|---|---|
| `GET  /api/repos/:id/refs` | List branches and the commit each one points to |
| `POST /api/repos/:id/objects/missing` | Given object IDs, return the ones the server doesn't have |
| `POST /api/repos/:id/objects` | Upload objects (batched) |
| `GET  /api/repos/:id/objects?ids=…` | Download objects (batched) |
| `POST /api/repos/:id/refs/:branch` | Move a branch from `old` to `new`, **only if it is still `old`**. Otherwise reject with "pull first" |

A push uploads any objects the server is missing, then moves the branch pointer, only if it hasn't changed since the student last pulled. A pull downloads missing objects and merges locally. Git objects are identified by their content hash, so uploads can be repeated safely.

On push, the server scans commit messages for `#12` / `fixes #12` and links those commits to tickets.

**Real wording, unlocked in tiers.** Every git button shows the command it ran (for example, `git commit -m "add player"`), so students learn the real terms.

| Tier | Unlocks | Default trigger |
|---|---|---|
| **1. Save & share** | status, stage, commit, push, pull, log, **simple conflict resolver** | Workspace opens |
| **2. Branches** | branch, switch, merge, pull requests (in-site review page) | Team reaches N commits, or teacher unlocks it |
| **3. Fixing things** | revert, diff between any two commits, tags, advanced conflict tools | Teacher unlocks it |

The conflict resolver is in tier 1 because teams that all commit to `main` will hit merge conflicts on their first `git pull`.

**Views:** the editor's git sidebar and the full-screen git page (`/workspace/[team]/[repo]/git`, with history graph and pull requests) use the same components from `modules/git/ui`.

**Export:** later, a team can push its repo to real GitHub (isomorphic-git supports this), to "graduate" to professional tools.

### Tickets

Students create and manage the tickets themselves. Teachers get visibility.

- **Board columns:** Backlog → To Do → In Progress → **Blocked** → Review → Done.
- **Blocked needs a reason.** Moving a ticket to Blocked requires a short note. The ticket then appears on the teacher dashboard with how long it has been blocked: the class's "raised hand" signal.
- **Ticket fields:** title, description, assignees, labels, column, comments, and linked commits.
- **Git link:** `fixes #12` in a commit message links the commit to the ticket. With tier 2, a **Start work** button creates a branch named like `12-player-movement`.
- **Teacher dashboard:** one row per team showing open, blocked, and done tickets, last commit time, and commits per student. These are progress signals for the teacher, not a public leaderboard.

### Progress and unlocking

- Level completion moves from `localStorage` to the student's account on the server.
- The workspace unlock rule comes from settings (for example, `workspace.unlockAfter = "level-4"`), with a per-student manual override in the admin page.
- Git tiers use the same progress system.

### Auth and roles

- **Roles:** admin (whoever installed it), teacher, student.
- **Students join with a class code** plus a username and password. No email required. Teachers can reset student passwords.
- **Google sign-in is optional**, since many schools use Google Workspace.
- **Library:** Better Auth or Auth.js, whichever works more cleanly with Next 16 and both supported databases.

## Data model

Built for **one install serving many teachers** from the start. A school, a district, or the project itself can run one shared install, so most teachers never set anything up.

```
school ─┬─ teacher (user, role=teacher)
        └─ class ─┬─ student (user, role=student) ── level_progress
                  └─ team ── team_member
                       └─ repo ─┬─ git_object   (id = sha, type, compressed bytes)
                                ├─ git_ref      (name, sha, updated_at)  ← changed only with "only if still old"
                                └─ ticket ─┬─ ticket_comment
                                           ├─ ticket_event (column moves, blocked reasons; feeds dashboard)
                                           └─ ticket_commit (links from commit messages)
settings (per school/class: modules on/off, unlock rules, git tiers, limits)
```

Schema lives in `server/db/` (Drizzle). The same schema runs on SQLite and Postgres.

## Hosting and deployment

Two supported setups. The **classroom box** comes first.

| Setup | Stack | Cost | Best for |
|---|---|---|---|
| **Classroom box** | `npm install && npm start` (Docker optional) on any Windows, macOS, or Linux machine the school already has. SQLite file in `data/`. | $0 | Most teachers. Works on the school network even when the internet is down. |
| **Free cloud** | Next app on a free host plus a free Postgres (for example, Neon or Supabase). | $0 within free-tier limits | Teachers who want students to work from home. |

- Plain Node is the main path because Docker is often blocked or confusing on school Windows PCs.
- Free-tier terms change often (sleeping after inactivity, rules against commercial use, credit-card checks). Re-check them before documenting any specific provider.
- Because the client does most of the work, a modest machine can serve a whole class.

## Teacher customization

- **First-run setup wizard** in the browser: school name, admin account, which modules to turn on. No config files needed.
- **Admin settings page** for everything else: modules on/off, workspace unlock rule, git tier triggers, team size, storage limits, whether teams can see each other's repos.
- **`pykit.config.ts`** as an optional override for advanced users.
- **Content folders:**
  - `content/templates/`: starter pygame projects. Each folder becomes a project template.
  - `content/sounds/`: the sound board pack.
  - `content/levels/`: the heist levels, eventually data-driven.

## Documentation

Docs are Markdown in `docs/guide/` and are served by the app at `/docs`. They always match the installed version and work without internet.

- **Getting Started:** what it is, install in 10 minutes, first class.
- **Setup:** one page per hosting option, plus backups and updates.
- **Customization:** templates, sounds, unlock rules, git tiers, branding.
- **How To…:** reset a password, unlock a tier for a student, move a student between teams, export a team's repo.

Contributor docs (this file, [ROADMAP.md](ROADMAP.md)) stay in `docs/`.

## Folder structure

```
app/
  workspace/
    page.tsx                      project picker
    [team]/[repo]/
      layout.tsx                  IDE shell (activity rail, panels)
      page.tsx                    editor view
      git/page.tsx                full-screen git view
      tickets/page.tsx            full-screen ticket board
  admin/                          teacher dashboard, classes, teams, settings
  setup/                          first-run wizard
  docs/[[...slug]]/page.tsx       renders docs/guide/*.md
  api/
    repos/[id]/…                  git sync API
    tickets/…  auth/…  progress/…
modules/
  runtime/      game iframe, Pyodide loader, loop rewrite, sound bridge, error mapping
  editor/       CodeMirror setup, tabs, file tree, diff view
  fs/           LightningFS wrapper, login download / logout wipe
  assets/       pixel-editor/, soundboard/
  git/          client/ (isomorphic-git ops), sync/ (API client), tiers/, ui/
  tickets/      board, blocked-reason flow, teacher views
  progress/     level completion, unlock rules
  auth/         class codes, roles, optional Google sign-in
server/
  db/           Drizzle schema + migrations
content/
  templates/  sounds/  levels/
docs/
  ARCHITECTURE.md  ROADMAP.md     contributor docs
  guide/                          teacher docs, served at /docs
public/
  pyodide/                        self-hosted Python runtime
```

## Decisions

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Collaboration | Git only | Live co-editing (Yjs) | Teaches real workflows. Avoids a WebSocket server, so it can run serverless. |
| Git server | Object/ref sync API in the DB | Git network protocol with repos on disk; Gitea | Works on serverless and free tiers. No git binary needed. |
| Game isolation | Sandboxed iframe, kept loaded | Web Worker; fresh iframe each run | SDL needs a page. Restarting Python each run is too slow on low-end devices. |
| Editor | CodeMirror 6 | Monaco | Lighter, already in use, works well with Next. |
| Database | SQLite default, Postgres optional | Postgres only | One-file setup for the classroom box. |
| Assets | Pixel editor + sound board | Arbitrary uploads | Focus on logic. Small repos, no moderation or storage concerns. |
| Install | Plain Node first | Docker first | Docker is often unavailable on school Windows machines. |
| Game framework | pygame-ce | Phaser | Phaser is unused and will be removed. |

## Open risks

These are tested in **Phase 0** (see [ROADMAP.md](ROADMAP.md)) before other work starts:

1. **pygame-ce in our Pyodide version.** Confirm the package is available and that drawing, keyboard input, and the clock work inside the iframe.
2. **Sound.** `pygame.mixer` may not work in the browser. Fallback: a Python module that plays sound-board sounds through Web Audio.
3. **Loop rewriting.** Confirm the automatic rewrite handles typical student game loops (nested functions, multiple loops, `sys.exit()`).
4. **Low-end performance.** Measure Python load time, memory, and frame rate on a 4 GB Chromebook.
5. **Resetting between runs.** Confirm that clearing student modules and globals gives each run a clean start, without a full restart.
