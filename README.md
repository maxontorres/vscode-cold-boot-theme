<p align="center">
  <img src="mx-logo-1.png" alt="MX - Maxon Torres, Software Consultant" width="480">
</p>

<h1 align="center">MX Y2K Techno Noir</h1>

<p align="center">
  A VS Code color theme and matching file icon theme built around a<br>
  Y2K techno-noir, early-2000s digital-futurist aesthetic.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code-%5E1.85-4CC9F0?style=flat-square&labelColor=07090D" alt="VS Code ^1.85">
  <img src="https://img.shields.io/badge/color%20theme-dark-FF4FD8?style=flat-square&labelColor=07090D" alt="Dark color theme">
  <img src="https://img.shields.io/badge/file%20icons-140-FFD166?style=flat-square&labelColor=07090D" alt="140 icons">
</p>

<p align="center">
  <a href="#color-theme">Color theme</a> ·
  <a href="#icons">Icons</a> ·
  <a href="#install">Install</a> ·
  <a href="#development">Development</a>
</p>

---

## What's inside

| Component | Where to enable it | Source |
|---|---|---|
| **MX Y2K Techno Noir** — dark color theme | **Preferences: Color Theme** | `themes/` |
| **MX Y2K Terminal Icons** — type-based file icons and purpose-based folder icons | **Preferences: File Icon Theme** | `icons/` |

## Color theme

- Near-black workspace with cyan operational accents
- Dense, technical UI with restrained contrast
- Inspired by Uplink, ENCOM-style interfaces, Windows 2000-era software, and cold industrial cyber-ops UI

| | Hex | Used for |
|---|---|---|
| ![#07090D](https://img.shields.io/badge/-%20%20%20%20-07090D?style=flat-square) | `#07090D` | Editor background |
| ![#E6EDF3](https://img.shields.io/badge/-%20%20%20%20-E6EDF3?style=flat-square) | `#E6EDF3` | Editor foreground |
| ![#4CC9F0](https://img.shields.io/badge/-%20%20%20%20-4CC9F0?style=flat-square) | `#4CC9F0` | Functions, tags, focus accents |
| ![#FF4FD8](https://img.shields.io/badge/-%20%20%20%20-FF4FD8?style=flat-square) | `#FF4FD8` | Keywords, cursor |
| ![#FFD166](https://img.shields.io/badge/-%20%20%20%20-FFD166?style=flat-square) | `#FFD166` | Constants, operators, attributes |
| ![#FFB454](https://img.shields.io/badge/-%20%20%20%20-FFB454?style=flat-square) | `#FFB454` | Strings |
| ![#A78BFA](https://img.shields.io/badge/-%20%20%20%20-A78BFA?style=flat-square) | `#A78BFA` | Types, classes |
| ![#2DD4BF](https://img.shields.io/badge/-%20%20%20%20-2DD4BF?style=flat-square) | `#2DD4BF` | Parameters, inline code |
| ![#718FA3](https://img.shields.io/badge/-%20%20%20%20-718FA3?style=flat-square) | `#718FA3` | Comments |

## Icons

<p align="center">
  <img src="concepts/uplink-icons-review.png" alt="MX Y2K Terminal Icons enlarged to 48px and at native 16px" width="744">
</p>

MX Icon Language v0.1 — Uplink Terminal takes inspiration from early-2000s hacker and network workstation interfaces. Sharp outlines, compact path glyphs, and restrained colors keep the icons technical and readable at 16px. Identity uses geometry and glyphs as well as color.

The theme has 48 file icons and 92 folder icons. File icons follow the file type: an extension picks the language or data format, and a file name only overrides it when the file itself is a tool manifest or config (`package.json`, `composer.json`, `Cargo.toml`, `Dockerfile`, `nginx.conf`) or a framework's own entry point (`manage.py`, `artisan`, `angular.json`). `UserController.php` is PHP and `auth.service.ts` is TypeScript. Folder icons follow the role of the directory (`src`, `config`, `migrations`, `tests`) and share one folder outline with a small glyph inside.

## Install

1. Run `npm run package` to build the VSIX.
2. In VS Code, run **Extensions: Install from VSIX...** and pick the generated file.
3. Select **MX Y2K Techno Noir** under **Preferences: Color Theme**.
4. Select **MX Y2K Terminal Icons** under **Preferences: File Icon Theme**.

## Development

Open this folder in VS Code and press `F5` to launch an Extension Development Host.

| Command | What it does |
|---|---|
| `npm run build:icons` | Regenerates the SVG assets, the icon theme JSON and the review sheet |
| `npm run validate` | Checks both themes |
| `npm run package` | Builds the VSIX |

Icons and mappings are defined in `scripts/build-icons.mjs`; edit that file rather than the generated SVGs or `icons/mx-y2k-icon-theme.json`. Open `concepts/uplink-icons-review.svg` at 100% to compare enlarged geometry with native 16px. The review sheet is excluded from the extension package.
