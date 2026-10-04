# MX Y2K Techno Noir

A VS Code color theme and matching file icon theme built around a Y2K techno-noir, early-2000s digital-futurist aesthetic.

Components:
- **MX Y2K Techno Noir** — the dark color theme, in `themes/`.
- **MX Y2K Terminal Icons** — the first production icon prototype, in `icons/`.

## Color theme

- Near-black workspace with cyan operational accents
- Dense, technical UI with restrained contrast
- Inspired by Uplink, ENCOM-style interfaces, Windows 2000-era software, and cold industrial cyber-ops UI

Select **MX Y2K Techno Noir** under **Preferences: Color Theme**.

## Icons

MX Icon Language v0.1 — Terminal takes inspiration from early-2000s hacker and network workstation interfaces. Sharp outlines, compact path glyphs, and restrained colors keep the icons technical and readable at 16px. Identity uses geometry and glyphs as well as color.

The prototype includes closed/open folders, generic files, PHP, TypeScript, JSON, HTML/HTM, CSS/SCSS/Sass, environment files, and Git configuration files. Package, Composer, and TypeScript configuration JSON use the JSON icon.

Select **MX Y2K Terminal Icons** under **Preferences: File Icon Theme**.

## Development

Open this folder in VS Code and press `F5` to launch an Extension Development Host.

Run `npm run build:icons` to regenerate the SVG assets, `npm run validate` to check both themes, and `npm run package` to build the VSIX. Open `concepts/terminal-icons-review.svg` at 100% to compare native 16px, monochrome, and enlarged geometry. The review sheet is excluded from the extension package.
