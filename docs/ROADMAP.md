# Planning Room Roadmap

The build plan for the Planning Room described in [ARCHITECTURE.md](ARCHITECTURE.md). The target is about **13 weeks** of solo, part-time work. There is no hard deadline, so the week numbers are a guide.

**Minimum shippable version:** levels → workspace unlock → team pygame project with commit, push, and pull → student-run ticket board → teacher dashboard.

---

## Phase overview

| Week | Phase | Done when |
|---|---|---|
| 1 | [0. Test pygame, clean up the repo](#phase-0--test-pygame-clean-up-the-repo-week-1) | Risks answered on a real low-end device |
| 2–3 | [1. Single-player IDE](#phase-1--single-player-ide-weeks-23) | A multi-file pygame project runs in the browser |
| 4 | [2. Pixel editor and sound board](#phase-2--pixel-editor-and-sound-board-week-4) | Assets created in-app load in pygame |
| 5–6 | [3. Backend](#phase-3--backend-weeks-56) | Students log in, progress is on the server, the workspace unlocks |
| 7–8 | [4. Git tier 1](#phase-4--git-tier-1-weeks-78) | Two students push, pull, and resolve a conflict |
| 9–10 | [5. Tickets and teacher dashboard](#phase-5--tickets-and-teacher-dashboard-weeks-910) | Teacher sees blocked tickets across teams |
| 11 | [6. Git tier 2](#phase-6--git-tier-2-week-11) *(stretch)* | Branches and pull requests work |
| 12 | [7. Packaging and docs](#phase-7--packaging-and-docs-week-12) | A teacher installs it by following the docs |
| 13 | [8. Testing with real users](#phase-8--testing-with-real-users-week-13) | Real users on cheap hardware, fixes made |

---

## Phase 0: Test pygame, clean up the repo (week 1)

**Test** at a throwaway route (for example, `/spike/pygame`), run on a **4 GB Chromebook**:

- [ ] pygame-ce loads in our Pyodide version and draws to a canvas inside a sandboxed iframe
- [ ] Keyboard input reaches the game; `pygame.time.Clock` keeps a steady frame rate
- [ ] Sound: does `pygame.mixer` work? If not, prototype the Web Audio fallback
- [ ] Automatic loop rewrite works on 3–4 typical student game loops
- [ ] Resetting between runs (clearing modules and globals) works without restarting Python
- [ ] Record Python load time, memory use, and frame rate

**Cleanup:**

- [ ] Load Pyodide from `public/pyodide/` instead of jsDelivr
- [ ] Remove `phaser`
- [ ] Combine the duplicate engines in `app/game/` and `app/levels/{hooks,lib}` into one shared runtime
- [ ] Pick one package manager and delete the other lockfile

**If a risk fails:** update the [Runtime section of ARCHITECTURE.md](ARCHITECTURE.md#runtime-running-pygame) before continuing.

## Phase 1: Single-player IDE (weeks 2–3)

- [ ] `modules/fs`: LightningFS wrapper (read, write, rename, delete, list)
- [ ] File tree with create, rename, and delete
- [ ] Tabs and a CodeMirror editor wired to the virtual FS, with autosave
- [ ] `modules/runtime`: game iframe kept loaded for the session, Python loaded in the background, Run and Stop buttons
- [ ] Mount the virtual FS into Pyodide before each run
- [ ] Console panel with tracebacks mapped to file and line, plus friendly explanations for common errors
- [ ] Service worker caching for the Python runtime
- [ ] One starter template in `content/templates/`
- [ ] Replace `app/workspace/data/mock.ts` with real data

## Phase 2: Pixel editor and sound board (week 4)

- [ ] Pixel editor: fixed sizes, palette, pencil, eraser, fill, undo
- [ ] Frames, exported as a sprite sheet
- [ ] Save PNGs to `assets/sprites/` in the virtual FS
- [ ] Sound board UI with a CC0 starter pack in `content/sounds/`; picking a sound copies it to `assets/sounds/`
- *Cut first if behind: frames and sprite sheets*

## Phase 3: Backend (weeks 5–6)

- [ ] Drizzle schema for school, class, team, user, level progress, and settings (SQLite and Postgres)
- [ ] Auth: admin, teacher, and student roles; class-code join; teacher password reset
- [ ] First-run setup wizard (`/setup`)
- [ ] Move level progress from `localStorage` to the server
- [ ] Workspace unlock rule plus per-student teacher override
- [ ] Basic admin pages: classes, teams, students
- *Cut if behind: Google sign-in*

## Phase 4: Git tier 1 (weeks 7–8)

- [ ] `modules/git/client`: stage, commit, log, status on the virtual FS
- [ ] Database tables for git objects and refs, plus the sync API (refs, missing objects, upload, download, "only if still old" branch update)
- [ ] Push and pull, with a "pull first" message when a push is rejected
- [ ] Simple conflict resolver: text (keep mine / keep theirs / edit by hand) and images (side by side)
- [ ] Download the repo on login, wipe local data on logout, warn about unpushed commits
- [ ] Git sidebar showing the real command for each action
- [ ] Offline: commit while disconnected, push when back online

## Phase 5: Tickets and teacher dashboard (weeks 9–10)

- [ ] Ticket tables (tickets, comments, events, commit links) and server actions
- [ ] Kanban board: Backlog, To Do, In Progress, Blocked, Review, Done
- [ ] Moving a ticket to Blocked requires a reason
- [ ] Link commits to tickets from `#12` / `fixes #12` on push
- [ ] Teacher dashboard: per-team ticket counts, blocked tickets with time blocked, last commit, commits per student
- [ ] Ticket board and git history work on phone screens

## Phase 6: Git tier 2 (week 11), stretch

- [ ] Branch, switch, merge
- [ ] Pull requests: diff view, comments, merge button
- [ ] "Start work" on a ticket creates a branch named like `12-player-movement`
- [ ] Full-screen git page with history graph
- [ ] Tier unlock rules in settings
- *Cut first if behind: the whole phase.*

## Phase 7: Packaging and docs (week 12)

- [ ] `npm install && npm start` works on Windows, macOS, and Linux with SQLite in `data/`
- [ ] Optional Dockerfile
- [ ] `/docs` route rendering `docs/guide/*.md`
- [ ] Guides: Getting Started, Setup (classroom box), Customization, How To…, Backups and updates
- [ ] Update `README.md` and `PROJECT_STATUS.md`
- *Cut if behind: the free-cloud setup guide*

## Phase 8: Testing with real users (week 13)

- [ ] Run a real session with a teacher, classmates, or anyone on a cheap Chromebook
- [ ] Have a semi-technical person install it using only the docs
- [ ] Fix the top issues; leave the rest as GitHub issues

---

## Cut order

If behind schedule, cut in this order:

1. Pull requests (Phase 6)
2. Git tier 3
3. Animation frames in the pixel editor
4. Google sign-in
5. Free-cloud setup guide

## After v1

- Git tier 3: revert, diff between any two commits, tags
- Free-cloud setup guide
- Export a team's repo to real GitHub
- "Pygame skills" modules in the level roadmap (sprites, animation, input)
- Level 4 and data-driven levels in `content/levels/`
