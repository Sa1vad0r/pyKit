# Heist School

**Learn Python by pulling off heists.** Heist School is a browser game where every level is a coding puzzle: you write real Python in an in-browser editor, hit run, and watch your masked baby-chick thief sneak past cameras, grab loot, and crack vaults. The Python runs entirely client-side via [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly), so there is no backend.

Your handler on the job is **lil guy**, a talking mascot who briefs you on the home page and walks you through each level with a spotlight tutorial.

> Built for **RowdyHacks XII** (`v0.1 // rowdyhacks`).

---

## Table of contents

- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Tech stack](#tech-stack)
- [Pages and routes](#pages-and-routes)
- [Levels and gameplay](#levels-and-gameplay)
- [Features](#features)
- [UI and theme](#ui-and-theme)
- [Project structure](#project-structure)
- [How the Python runtime works](#how-the-python-runtime-works)
- [Customizing](#customizing)
- [Adding a new level](#adding-a-new-level)
- [Browser storage](#browser-storage)
- [Known issues and roadmap](#known-issues-and-roadmap)
- [Credits](#credits)

---

## Quick start

### Requirements

- **Node.js 20.9 or newer** (Next.js 16 requirement)
- **npm** or **pnpm** (the repo includes lockfiles for both; pick one and stick with it)
- An internet connection on first load of a level: the levels download Pyodide from the jsDelivr CDN

### Set up and run

```bash
git clone <repo-url>
cd pyKit
npm install
npm run dev
```

Then open **http://localhost:3000**.

With pnpm instead:

```bash
pnpm install
pnpm dev
```

### Production build

```bash
npm run build
npm run start
```

> **Note:** This project uses Next.js 16, which has breaking changes from older versions. Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)).

---

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack) on port 3000 |
| `npm run build` | Create a production build                     |
| `npm run start` | Serve the production build                    |
| `npm run lint`  | Run ESLint (`eslint-config-next`)             |

---

## Tech stack

| Layer          | Choice                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| Framework      | [Next.js](https://nextjs.org) 16.3 (App Router, Turbopack)                              |
| UI library     | React 19.2                                                                              |
| Language       | TypeScript 5                                                                            |
| Styling        | Tailwind CSS v4 (via `@tailwindcss/postcss`), theme tokens in `app/globals.css`         |
| Fonts          | `next/font/google`: **JetBrains Mono** (main UI font) and **Geist** (sans)              |
| Python runtime | Pyodide v0.23.4 loaded from jsDelivr (a self-hosted copy also lives in `public/pyodide/`) |
| Code editor    | CodeMirror via `@uiw/react-codemirror`, `@codemirror/lang-python`, Tokyo Night theme    |
| Audio          | Web Audio API (mascot "peep" voice)                                                     |
| Installed, unused | `phaser`                                                                             |

---

## Pages and routes

| Route         | Page                 | Status         | What's there                                                                                                      |
| ------------- | -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/`           | **Operations** (home) | ✅ Working     | Terminal-style hero, lil guy's briefing, "Back to the job" card, and the **Job Board** table of all levels          |
| `/levels/1`   | **The Casing**       | ✅ Playable    | Tutorial level: a straight corridor using `move("LEFT")` / `move("RIGHT")`                                       |
| `/levels/2`   | **The Camera Gauntlet** | ✅ Playable | Security maze with 3 cameras, 3 money bags, and an exit                                                           |
| `/levels/3`   | **The Inside Job**   | ✅ Playable    | Vault-cracking puzzle with a scrambling 4-digit keypad                                                            |
| Level 4       | **The Vault**        | 🔒 Locked      | Shown on the Job Board as locked; no page yet                                                                     |
| `/workspace`  | **Planning Room**    | 🧪 UI mock     | IDE-style team workspace (files, editor, game preview, tickets) rendering placeholder data only                    |
| `/bird-peep`  | Talking overlay demo | 🧪 Demo        | Standalone test of a talking character that flaps its mouth while `demo.wav` plays                                |

### Navigation

The sticky navbar (`app/components/Navbar.tsx`) has:

- **HEISTSCHOOL** brand (padlock icon) → home
- **Operations** → `/`
- **Heist Map** → the last level you visited (remembered in `localStorage`), or Level 1 if none
- **Planning Room** → `/workspace`
- A **mascot mute toggle** and a `sys.online` status indicator

---

## Levels and gameplay

Every level page has the same layout: a **Python editor** with a **Run** button, a **console** that shows logs and your `print()` output, the **game board**, and an **Available APIs** reference panel. On load, a **spotlight tutorial** walks you through each panel; the game is locked until you finish it.

All levels show runtime status (`Loading Python runtime...` → `🟢 Python Runtime Ready` or `🔴 Python Runtime Error`). Failed attempts show a message and **auto-reset** after a couple of seconds.

### Level 1: The Casing (Tutorial, Beginner)

*"Scope the place out. Variables 101."* (`app/levels/1/TutorialLvl.tsx`)

- **Board:** a single 9-tile corridor.
- **Goal:** collect all 3 money bags, then reach the green **EXIT** tile.
- **API:** `move("LEFT")`, `move("RIGHT")`, plus `print()`.
- Moves animate one step every 300 ms.

### Level 2: The Camera Gauntlet (Infiltration, Intermediate)

*"Dodge three cameras, bag three diamonds."* (`app/levels/2/SecurityMazeGame.tsx`)

- **Board:** an 11×11 maze.
- **Goal:** collect 3 money bags and reach the exit without being spotted.
- **API:** `move("UP")`, `move("DOWN")`, `move("LEFT")`, `move("RIGHT")`, plus `print()`.
- **Cameras:** 3 static cameras, each seeing 3 tiles in the direction it faces. Walls block vision. Vision cones are drawn as red tiles; stepping into one trips the alarm.
- **Failure cases:** walking into a wall (collision), stepping into camera vision, an unknown direction string, a Python error, or a script that never calls `move()`.
- HUD shows **Moves** and **Items x / 3**.

### Level 3: The Inside Job (Cracking, Advanced)

*"Lift the code off the guard's terminal."* (`app/levels/3/VaultPuzzle.tsx`)

- **Board:** an animated vault door with a 4-dial keypad. Each dial cycles through digits once per second.
- **Goal:** lock all 4 dials on the target code within **20 seconds**.
- **How it runs:** your script is re-run **every second** against the current keypad.
- **Variables available to Python:**
  - `keys`: the 4 digits showing right now
  - `code`: the 4 digits you need to match
  - `locked`: which dials are already locked (`True`/`False`)
- **Function:** `lock(i)` locks dial `i` (0 to 3). Only call it when `keys[i] == code[i]`.
- **Failure cases:** 3 misfires (locking a dial on the wrong digit) trips the alarm; running out of time ends the round. Each reset generates a new random code.
- Visual feedback: a dial glows **amber** when it matches, turns **green** when locked; the door swings open and bolts retract on success; the vault shakes and lights flash red on alarm.

Starter code:

```python
if keys[0] == code[0]:
    lock(0)

# TODO: add a check for dial 1
# TODO: add a check for dial 2
# TODO: add a check for dial 3
```

### Level 4: The Vault (Heist, Expert)

*"The big one. Crack the cipher before the cops show."* Locked; not built yet.

---

## Features

- **Real Python in the browser:** no server, no install. Code runs in Pyodide; `stdout` is captured and shown in the in-game console.
- **Step-by-step animation:** each `move()` call is queued and replayed on the board so you can watch your plan play out.
- **Cancellable runs:** resetting or leaving a page cancels any in-flight run.
- **Spotlight tutorials:** `TutorialOverlay` dims the page, highlights one panel at a time, and explains it. It can optionally have lil guy "speak" each step.
- **lil guy, the talking mascot:**
  - Typewriter speech bubble with mouth-flap animation (`SpeakingMascot`)
  - A "peep" sound each time his mouth opens, with random pitch wobble so he sounds like he's talking
  - Falls back to a synthesized peep if the audio file can't load
  - Site-wide mute toggle, remembered across visits and synced across tabs
  - Home-page briefing summarizes your progress and points you to the next level
- **Job Board:** a terminal-style table with level ID (hex), sector, mission, clearance, progress bar, and a resume/replay action.
- **"Back to the job" card:** jumps straight into the first unfinished, unlocked level.
- **Heist Map memory:** the navbar remembers the last level you played.
- **Inline SVG sprites:** chick thief, money bags (shake animation), sweeping security cameras with blinking LEDs, and the vault door, so no image assets are needed for gameplay.
- **Alternate Level 2 board themes:** `app/levels/2/boards/` contains four board renderers (Classic, Night Vault, Blueprint, Cardboard). See [Customizing](#customizing).
- **Planning Room mock:** a four-panel IDE layout (activity rail, repo tree, editor + pygame-style preview, ticket board) for a future team-project mode.

---

## UI and theme

The look is a dark, terminal-inspired "heist" theme called **c-slate**. Text uses lowercase command-style labels (`> get_back_in`, `> resume`, `root@heistschool:~$ ls ./missions --available`) and a blinking cursor after headings.

### Color palette

All colors are CSS variables in `app/globals.css` and are exposed to Tailwind through `@theme inline`, so you can use them as classes like `bg-panel`, `text-accent-primary`, or `border-line`.

**Surfaces**

| Token              | Hex                       | Tailwind class             | Used for                     |
| ------------------ | ------------------------- | -------------------------- | ---------------------------- |
| `--background`     | `#161b22`                 | `bg-background`            | Page background              |
| `--panel-deep`     | `#0d1117`                 | `bg-panel-deep`            | Deepest wells                |
| `--panel-muted`    | `#1c2128`                 | `bg-panel-muted`           | Navbar, tables, side cards   |
| `--panel`          | `#21262d`                 | `bg-panel`                 | Cards, walls, row hover      |
| `--panel-elevated` | `#2d333b`                 | `bg-panel-elevated`        | Active nav item, bar tracks  |
| `--line`           | `#2d333b`                 | `border-line`              | Hairline borders             |
| `--muted`          | `#272d37`                 | `bg-muted`                 | Muted fills                  |

**Text**

| Token                | Hex       | Tailwind class          |
| -------------------- | --------- | ----------------------- |
| `--foreground`       | `#f0f6fc` | `text-foreground`       |
| `--muted-foreground` | `#9caab9` | `text-muted-foreground` |
| `--dim`              | `#7d8a99` | `text-dim`              |
| `--faint`            | `#4b5563` | `text-faint`            |

**Accents**

| Token                            | Value                       | Notes                                      |
| -------------------------------- | --------------------------- | ------------------------------------------ |
| `--accent-primary`               | `#71f6d0` (mint)            | Brand color, buttons, links, "complete"    |
| `--accent-primary-foreground`    | `#0d1117`                   | Text on mint buttons                       |
| `--accent-secondary`             | `#1c3d37` (deep pine)       | Secondary fills                            |
| `--accent-secondary-foreground`  | `#71f6d0`                   | Text on pine                               |
| `--panel-border`                 | `rgba(113, 246, 208, 0.18)` | Default card border (mint tint)            |
| `--panel-border-hover`           | `rgba(113, 246, 208, 0.45)` | Card border on hover                       |
| `--border`                       | `rgba(113, 246, 208, 0.15)` | Default border color for every element     |

**Syntax / status colors**

| Token            | Hex       | Used for                        |
| ---------------- | --------- | ------------------------------- |
| `--slate-yellow` | `#e3b341` | "Active" level, Intermediate, in-progress tickets |
| `--slate-orange` | `#ffa657` | Advanced                        |
| `--slate-purple` | `#d2a8ff` | Expert                          |
| `--slate-blue`   | `#79c0ff` | Syntax highlight                |
| `--slate-red`    | `#ff7b72` | Syntax highlight / danger       |

### Difficulty → clearance mapping

Defined in `app/components/levelStyles.ts`:

| Difficulty   | Clearance label | Color            |
| ------------ | --------------- | ---------------- |
| Beginner     | pickpocket      | mint (`accent-primary`) |
| Intermediate | burglar         | yellow           |
| Advanced     | safecracker     | orange           |
| Expert       | mastermind      | purple           |

Progress bars fill with the clearance color, or mint once the level is complete. The Job Board legend reads: mint = complete, yellow = active, gray = locked.

### Typography

- **JetBrains Mono** (`--font-terminal-mono`) is the body font for the whole app, with `ui-monospace` / `Consolas` fallbacks.
- **Geist** (`--font-geist-sans`) is available as `font-sans`.
- Small sizes dominate (11–13 px) to keep the terminal feel; headings are bold, 30–38 px.

### Game screens

The level pages use Tailwind's `zinc` palette for panels, `emerald` for the exit and success states, `amber` for loot, and `red` for camera vision and alarms. The code editor uses the **Tokyo Night** CodeMirror theme.

---

## Project structure

```
app/
  layout.tsx                 Root layout: fonts, metadata, dark theme
  page.tsx                   Home page (Operations)
  globals.css                c-slate theme tokens + Tailwind setup
  data/levels.ts             Level list: names, difficulty, progress, routes, locked flag
  components/
    Navbar.tsx               Sticky top nav + "Heist Map" last-level memory
    MiddleColumn.tsx         Home hero, briefing, Job Board
    LevelTable.tsx           Job Board table
    ContinueSession.tsx      "Back to the job" card
    GuideGreeting.tsx        lil guy's home-page briefing
    ProgressBar.tsx          Loot progress bar
    levelStyles.ts           Difficulty → clearance label/colors
    LevelList.tsx, LevelCard.tsx   Older carousel-style level cards (not on the home page)
    mascot/
      SpeakingMascot.tsx     Talking mascot with typewriter bubble
      MascotMuteToggle.tsx   Mute button
      mascotConfig.ts        Images, peep sound, volume, pitch jitter
      mascotMute.ts          Shared mute state (localStorage + cross-tab sync)
      peepEngine.ts          Web Audio peep player / synth fallback
      usePeep.ts             Hook wrapper for the peep engine
  levels/
    1/                       The Casing (TutorialLvl.tsx)
    2/                       The Camera Gauntlet (SecurityMazeGame.tsx)
      boards/                Alternate board themes for Level 2
    3/                       The Inside Job (VaultPuzzle.tsx)
    components/              TutorialOverlay, HintMascot, CodeEditor, ConsolePanel, MazeBoard
    hooks/                   usePyodideRuntime, useMazeRunner (shared engine, mostly unused)
    lib/                     Constants, directions, security maze data
  game/                      Earlier modular maze engine (not routed)
  workspace/                 Planning Room UI mock (+ data/mock.ts)
  bird-peep/                 Talking overlay demo
public/
  pyodide/                   Self-hosted Pyodide runtime files
  mascot/                    lil guy sprites (lil-open.png, lil-closed.png)
  sounds/                    peep.mp3, demo.wav
  bird-peep/                 Demo sprites
  game/                      starter.py and sprite for the old engine
assets/                      Source art for lil guy
```

---

## How the Python runtime works

Each level component (for example `SecurityMazeGame.tsx`):

1. On mount, injects `https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js` once (shared via a `pyodide-script` element id) and calls `loadPyodide()`.
2. When you click **Run**, registers JavaScript functions as Python globals (`move`, `lock`, and so on) with `pyodide.globals.set(...)`.
3. Redirects `sys.stdout` to an `io.StringIO`, runs your code with `runPythonAsync`, and prints captured output to the console.
4. For maze levels, `move()` calls are recorded first, then replayed with a delay to animate the player and check walls, items, cameras, and the exit.
5. For Level 3, the script is executed once per tick with fresh `keys` / `code` / `locked` values.

A newer shared engine in `app/levels/hooks/usePyodideRuntime.ts` can load the self-hosted runtime from `public/pyodide/` instead, but the current levels don't use it yet.

---

## Customizing

### Mascot (`app/components/mascot/mascotConfig.ts`)

| Setting                    | Default              | Meaning                                                    |
| -------------------------- | -------------------- | ---------------------------------------------------------- |
| `MASCOT_IMAGES`            | `/mascot/lil-*.png`  | Closed / open mouth sprites                                |
| `MASCOT_PEEP_SRC`          | `/sounds/peep.mp3`   | Sound file, `"synth"` for the built-in peep, `null` for silent |
| `MASCOT_PEEP_VOLUME`       | `0.12`               | 0–1                                                        |
| `MASCOT_PEEP_PITCH_JITTER` | `0.15`               | Random pitch variation per peep (±15%)                     |
| `MASCOT_PEEP_MAX_MS`       | `200`                | Longest a single peep may play                             |

### Level 2 board theme (`app/levels/2/boards/index.ts`)

Set `BOARD_THEME` to `"classic"`, `"night-vault"`, `"blueprint"`, or `"cardboard"`, and `SHOW_THEME_PICKER = true` to show theme buttons in dev. Note: `SecurityMazeGame.tsx` currently renders its own inline board and does not import these yet.

### Level list (`app/data/levels.ts`)

Edit names, descriptions, difficulty, category, `current`/`total` progress, `href`, and `locked`. A level with `href: null` shows a disabled action on the Job Board.

### Colors

Change the hex values in `:root` in `app/globals.css`. Every Tailwind class that uses a token updates automatically.

---

## Adding a new level

1. Create `app/levels/<n>/page.tsx` that renders `<Navbar />` and your game component (copy an existing level page).
2. Build the game component. The simplest route is to copy `app/levels/1/TutorialLvl.tsx` and change the grid, items, starter code, and the functions exposed to Python.
3. Write `TutorialStep[]` entries pointing at your panel refs and pass them to `<TutorialOverlay />`.
4. Add or update the entry in `app/data/levels.ts` with `href: "/levels/<n>"` and `locked: false`.

---

## Browser storage

| Key                         | Set by                 | Purpose                           |
| --------------------------- | ---------------------- | --------------------------------- |
| `heistschool:lastLevel`     | `Navbar.tsx`           | Last level visited, for Heist Map |
| `heistschool.lilguy.muted`  | `mascotMute.ts`        | Mascot mute on/off (`"1"`/`"0"`)  |

Both reads/writes are wrapped in `try/catch`, so the app still works in private browsing.

---

## Known issues and roadmap

- **Progress is hard-coded.** The `current`/`total` loot values in `data/levels.ts` aren't tracked from gameplay yet.
- **Level 4 isn't built.**
- **Duplicated engine code.** Each level inlines its own Pyodide loader, types, and sprites; `app/game/` and `app/levels/{hooks,lib}` are older/unused engines. Consolidating onto one shared engine is the next cleanup.
- **Pyodide needs the network.** Levels load v0.23.4 from jsDelivr, while a self-hosted copy sits unused in `public/pyodide/`. Switching to the local copy would make offline/demo-venue play reliable.
- **Level 2 board themes** in `boards/` aren't wired into the level yet.
- **Planning Room** is UI only, using placeholder data from `workspace/data/mock.ts`. The plan to turn it into a real in-browser pygame IDE with built-in git and tickets is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).
- **Housekeeping:** both `package-lock.json` and `pnpm-lock.yaml` exist; `phaser` is installed but unused.

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for a longer status snapshot.

---

## Credits

- Built at RowdyHacks XII by the Heist School team.
- Lil guy's voice (`public/sounds/peep.mp3`): "Short Chick Sound" by [Nikin](https://pixabay.com/users/nikin-253338/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=171389) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=171389)
- Python runtime: [Pyodide](https://pyodide.org)
- Editor: [CodeMirror](https://codemirror.net) with the Tokyo Night theme
