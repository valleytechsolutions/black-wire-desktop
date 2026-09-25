<p align="center">
  <img src="docs/brand/black-wire.png" width="110" alt="Black Wire logo"> &nbsp;&nbsp;
  <img src="docs/brand/valleytech.png" width="80" alt="Valleytech Solutions logo">
</p>
<h1 align="center">Black Wire<br>Technical Reference Guide</h1>
<p align="center"><strong>Know your board. Make the connection.</strong><br>A Valleytech Solutions project, made for the workbench.</p>
<p align="center">Makers · Educators · Students · Hobbyists · Engineers</p>

<p align="center"><a href="https://github.com/valleytechsolutions/black-wire-desktop/releases">Downloads & release status</a> · <a href="https://github.com/valleytechsolutions/black-wire-pinouts">Browse the pinout collection</a> · <a href="docs/BUILDING.md">Build the app</a> · <a href="CONTRIBUTING.md">Contribute</a></p>
<p align="center"><img alt="Edition" src="https://img.shields.io/badge/edition-workshop_preview-d5f58a?style=flat-square&labelColor=17211f"> <img alt="Offline" src="https://img.shields.io/badge/reference_library-offline-d5f58a?style=flat-square&labelColor=17211f"> <img alt="Platforms" src="https://img.shields.io/badge/targets-Windows_%7C_Linux_%7C_macOS-d5f58a?style=flat-square&labelColor=17211f"></p>

![Black Wire board library, with manufacturer and microcontroller filters](docs/screenshots/library.png)

## Your board. Its pins. One place.

Black Wire is an offline desktop workbench for the moment you need to know **what that pin does**. Find the exact board, open its original pinout, check its revision and source, and keep the references you use most within reach.

Built for a student's first breadboard, an educator's lab, a hobbyist's parts drawer and an engineer's prototype bench.

| At your bench | What the app does |
|---|---|
| Find the right board | Search names, aliases and filenames; filter manufacturer, MCU variant, family and review status. Dashes, spaces and underscores work interchangeably. |
| Read the details | Zoom, pan and rotate diagrams; browse local PDFs; save the original-resolution file. |
| Check the source | Keep source links, revision notes, coverage labels and hashes with each reference. |
| Plan power | Read sourced voltage/current profiles and published observations; compare adapter ratings, estimate battery runtime and total power across voltage rails. |
| Keep your work | Save boards and your own measurements locally; import/export JSON backups. |
| Stay offline | No account, analytics or cloud sync. External source and YouTube links open only when selected. |

### A growing library

**2,988 reference entries · 1,358 reviewed physical pinout images · 59 brands/source groups.** There are 1,682 populated catalog records, including shared references and unreviewed source products. This is a collection snapshot, not a claim to cover every board ever made.

ESP32 variants including C5/C6/S3, RP2040/RP2350, CYD displays, Arduino, Teensy, Raspberry Pi, other SBCs, radio boards and GPIO devices are indexed separately where their identities are known. Chip-package references are labeled separately from board pinouts.

## Look closer

![Pinout viewer with original source and revision details](docs/screenshots/pinout-viewer.png)

Original images stay intact. Partial maps and unknown revisions remain visible so users can compare the reference with the board on their bench.

![Power desk with sourced voltage and current observations](docs/screenshots/power-desk.png)

The power desk includes **13 sourced profiles and 22 published operating observations**. Manufacturer requirements, nominal values, published measurements and personal bench readings are distinct. Unknown values stay unknown. Published observations were not measured by Black Wire; a typical current reading is not a guaranteed maximum or a supply recommendation.

## Download and open

Check [Releases](https://github.com/valleytechsolutions/black-wire-desktop/releases) for the actual available assets and validation status. An absent platform asset means that platform has not been released.

| Platform | Current status |
|---|---|
| Windows x64 | Native app tested; 0.1.1 installer built and packaged app tested. Installation on a clean Windows machine still needs validation. Workshop builds are unsigned unless the release explicitly says otherwise. |
| Linux x64 / ARM64 | Packaging supported; native launch validation remains outstanding. |
| macOS Intel / Apple Silicon | Build targets provided; a Mac, Developer ID signing and notarization are needed for a distributable release. No verified Mac binary is claimed. |

For Windows, download the complete installer from a release, then open it from File Explorer. It creates desktop and Start menu shortcuts and keeps the reference library with the app. Portable ZIP users must extract **all** files before opening the application. Do not move a lone EXE out of its folder.

Read [DOWNLOADS.md](docs/DOWNLOADS.md) for checksums, signing status and security warnings. A checksum checks download integrity; it does not replace a trusted publisher signature. Preview builds may still trigger Windows warnings.

## Two repositories, one field guide

- **[black-wire-pinouts](https://github.com/valleytechsolutions/black-wire-pinouts):** images, PDFs, catalog, board pages and per-reference attribution.
- **This repository:** desktop application, power data, UI screenshots, tests and packaging. Large library files are imported during a build; personal bookmarks and measurements are never part of the repository.

See [Build and development](docs/BUILDING.md), [Workbench guide](docs/WORKBENCH.md), [Attribution](ATTRIBUTION.md) and [Contribution guide](CONTRIBUTING.md).

## Attribution and project status

Original board artwork belongs to its credited authors/manufacturers. This application does not claim ownership or grant new permissions over those references. See the collection's [per-asset ledger](https://github.com/valleytechsolutions/black-wire-pinouts/blob/main/catalog/attributions.csv) before reuse. The original application source is published for inspection; an open-source license has not yet been selected. See [LICENSE.md](LICENSE.md).

The workshop preview is the starting point for a lasting maker reference. A wiki and annual print editions are future projects, with separate completeness, rights and print-quality reviews.

---
Created and curated by **—your pal kal** · [@valleytechsolutions on YouTube](https://www.youtube.com/@valleytechsolutions)

Black Wire and Valleytech logos belong to their creator. Manufacturer names and trademarks identify the referenced hardware; they do not imply endorsement.
