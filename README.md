# CP Contest Manager CLI (cpm)

> A CLI tool to manage, organize, and track your Competitive Programming contest solutions.

`cpm` gives you a centralized workspace to create contest folders, track AC status per-problem, search through your code, integrate with Git, and export solutions — all from your terminal.

---

## Features

| Category | Features |
|----------|---------|
| **Contests** | Create, list, delete, rename, open, export |
| **Problems** | Add, delete, mark AC, rename, open, move between contests |
| **Tracking** | Per-problem AC status, auto-commit on mark |
| **Statistics** | Overall stats + breakdown by tag (`prefix_contestname`) |
| **Search** | Real-time full-text search across all problem source files |
| **Git** | Link repo, push (per-contest commits), pull |
| **Templates** | Create, edit, delete templates per language extension |
| **Editors** | VS Code & Zed |
| **Platform** | ✅ Windows &nbsp; ✅ Linux &nbsp; ✅ macOS |

---

## Installation

**Requirements**: [Node.js](https://nodejs.org/) v16+

```bash
# 1. Clone the repository
git clone https://github.com/nourist/cp-contest-manager-cli.git
cd cp-contest-manager-cli

# 2. Install dependencies
npm install

# 3. Install globally
npm install -g .
```

After installation, `cpm` is available anywhere in your terminal.

> **Linux/macOS note**: Config is stored at `~/.config/cpm/config.json` — no root permissions needed at runtime.

---

## Quick Start

```bash
# 1. Set up your contest directory
cpm config

# 2. Create a new contest
cpm create

# 3. List all contests
cpm list

# 4. Show statistics
cpm stat
```

---

## Configuration

Config is stored at a platform-appropriate user directory (not inside the package):

| OS | Location |
|----|---------|
| Windows | `%APPDATA%\cpm\config.json` |
| Linux / macOS | `~/.config/cpm/config.json` (or `$XDG_CONFIG_HOME/cpm/config.json`) |

```bash
cpm config [path] [-c <content>]
```

| Option | Description |
|--------|-------------|
| `[path]` | Directory path for the selected content type |
| `-c contestDir` | Path to the directory containing all your contests |
| `-c exportDir` | Path to the directory where exported files go |
| `-c defaultLang` | Default file extension for new problems (`cpp`, `py`, `java`, `js`, …) |
| `-c autoCommit` | Auto git-commit when marking a problem/contest as AC (`true`/`false`) |
| `-c autoOpen` | Auto open the contest in editor after `cpm create` (`true`/`false`) |
| `-c editor` | Editor to use: `vscode` (default) or `zed` |

Running `cpm config` without arguments launches an interactive menu.

---

## Commands

### `cpm list`
List all contests in a formatted table showing name, problems, and last-updated date.

```bash
cpm list [--ac]
```

| Flag | Description |
|------|-------------|
| `-a, --ac` | Show only fully-completed (all-AC) contests |

Completed problems are highlighted in **green**. Fully AC contests have all columns colored green.

---

### `cpm create`
Create a new contest interactively. Prompts for contest name and problem list.

```bash
cpm create [--sub] [--io]
```

| Flag | Description |
|------|-------------|
| `-s, --sub` | Create a sub-directory for each problem (e.g. `contest/A/A.cpp`) |
| `-i, --io` | Create `.inp` / `.out` files alongside each problem source |

**Problem naming**: Enter problems space-separated. Override the default language per-problem by appending the extension:
```
A B C.py D.java
```
This creates `A.cpp B.cpp C.py D.java` (assuming `defaultLang = cpp`).

**File structure created** (flat mode, default):
```
<contestDir>/
└── mycontest/
    ├── A.cpp
    ├── B.cpp
    └── test/
        ├── A_test.cpp      ← stress-test template
        ├── A_brute.cpp     ← brute-force template
        ├── B_test.cpp
        └── B_brute.cpp
```

---

### `cpm delete [name]`
Delete a contest and all its files. Prompts interactively if no name is given.

---

### `cpm mark [name]` / `cpm unmark [name]`
Mark all problems in a contest as AC / not-AC. If `autoCommit` is enabled, triggers a git commit automatically.

---

### `cpm rename`
Rename a contest.

```bash
cpm rename [-o <oldname>] [-n <newname>]
```

---

### `cpm open [name]`
Open a contest directory in the configured editor.

```bash
cpm open [name]
```

Prompts with a searchable list if no name is given. If `autoOpen` is enabled, this is called automatically after `cpm create`.

---

### `cpm workspace`
Open the entire contests directory in the editor.

```bash
cpm workspace
```

---

### `cpm export [name]`
Copy source files (`.cpp`, `.c`, `.py`, etc.) from a contest into the configured `exportDir`.

```bash
cpm export [name] [--all] [--ac]
```

| Flag | Description |
|------|-------------|
| `-a, --all` | Export all contests |
| `-c, --ac` | Combined with `--all`: export only fully-completed contests |

---

### `cpm stat`
Display two statistics tables:

1. **Overall summary** — total/AC contests, total/solved problems, completion rates
2. **Tag breakdown** — contests grouped by the prefix before the first `_` in their name

**Tagging convention**: Name your contests with a `tag_` prefix:
```
cf_round1      → tag: cf
vnoj_2024      → tag: vnoj
mycontest      → tag: No tag
```

---

### `cpm search`
Real-time full-text search across all problem source files.

```bash
cpm search
```

- Type search terms (space-separated) to filter problems
- Results are ranked by number of distinct terms matched
- Matching lines are highlighted with context snippets in the preview
- Press **Enter** to open the selected file in the editor

---

## Git Integration

### `cpm link [url]`
Initialize git (if needed) and set the remote origin.

```bash
cpm link https://github.com/yourname/your-repo.git
```

### `cpm repo`
Show the currently linked remote URL.

### `cpm push [message]`
Commit and push changes. Creates one commit per changed contest (e.g. `Update contest: cf_round1`) plus a separate commit for any root-level file changes.

```bash
cpm push "add solutions"
```

### `cpm pull`
Pull latest changes from the remote repository.

---

## Template Management

Templates are stored in `src/template/` of the package. Each language has two files:
- `<ext>.txt` — the main solution template
- `<ext>_test.txt` — the stress-test / brute-force tester template

The placeholder `{name}` in templates is replaced with the problem name when files are created.

```bash
cpm template create [ext]    # Create a blank template for a new language
cpm template edit [ext]      # Open template in editor to customize
cpm template delete [ext]    # Delete a template
```

**Default C++ template** includes common macros (`FOR`, `FOD`, `ll`, `pii`, bit manipulation helpers) and auto file I/O detection.

**Default C++ test template** provides a stress-testing framework with `gen()`, `compile()`, and `test()` functions to compare a main solution against a brute-force for random inputs.

---

## Problem Management

All problem commands work interactively if no `[contest]` argument is provided.

```bash
cpm problem add [contest] [--sub] [--io]    # Add problems to existing contest
cpm problem delete [contest]                 # Delete problems (checkbox select)
cpm problem mark [contest]                   # Toggle AC status per-problem (checkbox)
cpm problem rename [contest]                 # Rename a problem and its files
cpm problem open [contest]                   # Open a problem's source file in editor
cpm problem move [contest]                   # Move a problem to another contest
```

**`problem mark`** shows a checkbox list pre-checked with current AC status. Deselecting a problem marks it as not-AC.

---

## Directory Structure

```
<contestDir>/
├── data.json                  ← AC status tracking (auto-managed, commit this to git)
├── .git/                      ← if linked with `cpm link`
│
├── cf_round1/                 ← flat mode (default)
│   ├── A.cpp
│   ├── B.cpp
│   └── test/
│       ├── A_test.cpp
│       ├── A_brute.cpp
│       └── ...
│
└── vnoj_2024/                 ← sub-directory mode (--sub) with I/O (--io)
    ├── A/
    │   ├── A.cpp
    │   ├── A.inp
    │   └── A.out
    └── test/
        └── ...
```

---

## Development

```bash
# Run locally without global install
npm run start -- <command>

# Examples
npm run start -- list
npm run start -- create --sub --io
npm run start -- stat
```

---

## License

Licensed under [CC BY-NC 4.0](LICENSE) — free for personal and educational use, not for commercial purposes.

---

## Acknowledgments

| Library | Purpose |
|---------|---------|
| [commander](https://www.npmjs.com/package/commander) | CLI command parsing |
| [inquirer](https://www.npmjs.com/package/inquirer) | Interactive prompts |
| [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) | Real-time search prompt (`cpm search`) |
| [inquirer-search-list](https://www.npmjs.com/package/inquirer-search-list) | Searchable list prompt |
| [colors](https://www.npmjs.com/package/colors) | Colored terminal output |
| [cli-table3](https://www.npmjs.com/package/cli-table3) | Table rendering in terminal |
| [fs-extra](https://www.npmjs.com/package/fs-extra) | Enhanced file system operations |
| [app-root-path](https://www.npmjs.com/package/app-root-path) | Package root path resolution |

---

Created and maintained by [Nourist](https://github.com/nourist). If you find this tool useful, consider giving it a ⭐ on GitHub!

