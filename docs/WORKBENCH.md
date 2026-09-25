# Black Wire Technical Reference Guide

Workshop preview 0.1.1 • September 2026 • Made by Kal

An offline desktop workbench for finding board pinouts, keeping references close, and checking power data. The Black Wire arrow is the primary identity; Valleytech appears in the sidebar, footer and About. **—your pal kal** · [@valleytechsolutions](https://www.youtube.com/@valleytechsolutions)

## Open the application

**Windows:** double-click the **Black Wire Technical Reference Guide** shortcut on your Windows desktop. You can also open `release/win-unpacked/Black Wire Technical Reference Guide.exe` from **File Explorer**. Open it locally, rather than following an EXE link in a web browser; the browser may show an Internet-security warning. Keep the complete `win-unpacked` folder together, including its `resources` directory. No Node.js installation or internet connection is needed to use the packaged app.

**Linux:** when a matching Linux archive is available in Releases, extract it, then run `black-wire-technical-reference-guide` from the extracted folder. These are desktop Linux builds, not Raspberry Pi OS Lite or 32-bit ARM builds. They require the normal Electron desktop runtime dependencies. Native Linux launch testing remains outstanding.

**macOS:** the application has a Mac target and platform-neutral interface, storage and file handling. A Mac is required to produce and test its `.app`, ZIP and DMG. No Mac binary has been verified or supplied from this Windows machine. Build instructions are below.

Windows is a locally tested, unsigned workshop build. Release signing and macOS notarization are not configured.

## What is included

- 2,988 searchable reference entries across 1,682 populated catalog records and 59 brands/source groups.
- All 1,358 reviewed physical pinout images from the curated collection, plus original PDFs and additional manufacturer source references.
- Search by board, processor variant, manufacturer, filename and alias; filters by manufacturer, processor, family, reference type and review status.
- Quick access for ESP32-C5, ESP32-S3, RP2040, RP2350 and CYD displays.
- Images with zoom, pan and rotation; a local PDF viewer with page navigation; original-file exports and source/revision details.
- Saved boards, local measurement records, and JSON backup import/export.
- A power desk with 13 sourced profiles and 22 published operating observations, plus adapter comparison, battery math and multi-rail power budgets.

Press **Ctrl+K** (Command+K on Mac) or **/** to focus search. Select a board to open its reference sheets. Use **Reference type → Pinout** when you want only physical pinout diagrams. “Unreviewed source” files include dimensions, hardware overviews and other original manufacturer material. Chip-package diagrams remain separately labeled.

The library is a snapshot. New files added by other collection work appear after rebuilding the catalog and application. Existing source folders are not renamed or edited by the application.

## Power data

The chart distinguishes recommended adapter capacity, allowed input voltage, nominal voltage, published operating observations and your own measurements. **None of the published observations were measured by Black Wire.** Input connector, board revision, conditions, source and limitations travel with each profile. Unknown ratings remain blank.

Profiles cover Raspberry Pi Pico/Pico 2, Pi 5/4B/3B+/Zero 2 W, Arduino UNO R3, Teensy 2.0/++2.0/4.0/4.1, Espressif ESP32-C5-DevKitC-1 revision 1.2, and Heltec Wireless Paper. Published observations include the Pico datasheet workload, PJRC power measurements, Raspberry Pi typical figures and Heltec operating-current tables. Not every profile has a measured result.

An adapter comparison is a check of entered ratings, not electrical validation. A typical idle reading is not a worst-case supply requirement. Battery math estimates voltage, capacity and runtime; it does not choose protection or charging hardware.

Source URLs and sections are recorded in `data/power-profiles.json` and displayed in the app. The saved Heltec PDF is included locally. Opening an external source website requires a connection; reading the stored facts and bundled references does not.

## Your records

Bookmarks and measurements are saved in Electron's user-data folder under **Black Wire Technical Reference Guide**:

- Windows: `%APPDATA%/Black Wire Technical Reference Guide/workbench.json`
- Linux: `$XDG_CONFIG_HOME/Black Wire Technical Reference Guide/workbench.json`, normally `~/.config/...`
- macOS: `~/Library/Application Support/Black Wire Technical Reference Guide/workbench.json`

Use **About the guide → Export backup** to move your personal records between systems. Import merges records. A personal backup does not contain the image library. Browser development previews use their own local browser storage.

## Build and update

Follow [BUILDING.md](BUILDING.md) first to import the collection from its separate repository. Use Node.js 24 LTS and pnpm 11.19.0. Run these commands in the `Black Wire App` folder:

```sh
pnpm install --frozen-lockfile
node node_modules/electron/install.js
pnpm build
pnpm start
```

To regenerate the library from the full guide's parent folder:

```sh
pnpm catalog
pnpm build
node scripts/verify-library.mjs
```

`BLACKWIRE_SOURCE_ROOT` may point to another full guide folder. The existing source collections and `_Catalog/ASSETS.json` and `BOARDS.json` must be present there. The standalone source bundle already contains a built `library` and `public/catalog.json`; it can be built without reindexing the original collection.

Native packaging:

```sh
# Windows
pnpm dist:win
# Linux (run on Linux)
pnpm dist:linux
# macOS (run on a Mac; both Intel and Apple Silicon)
pnpm dist:mac
```

For local Windows packaging with the installed runtime, the verified command is:

```sh
node node_modules/electron-builder/cli.js --win dir --x64 --config.electronDist=node_modules/electron/dist
```

The Linux tar archives can also be prepared from Windows using `electron-builder --linux tar.gz --x64 --arm64`. Creating macOS packages requires macOS. Signing credentials must be configured before a signed public release. The repository-specific setup is in [BUILDING.md](BUILDING.md).

Useful checks:

```sh
pnpm test
pnpm exec playwright install chromium
pnpm test:ui
node scripts/verify-library.mjs
# Native Windows application, isolated test data:
node tests/electron-smoke.mjs --packaged
```

## Project layout and known limits

`src` contains the interface and power calculations; `electron` contains the sandboxed desktop shell; `scripts` builds and verifies the catalog; `data` contains power sources and collection reports; `library` contains hash-addressed originals and previews; `release` contains packaged apps. Original logos are retained under `public/brand`. Runtime dependency notices are bundled as `THIRD_PARTY_NOTICES.txt`.

The catalog indexes all 2,187 supported media/document files in the original manufacturer and supplemental source collections, including identical-file aliases. Raw research caches and rejected candidates are not presented as reviewed references. Catalog record counts include source product records and shared references, not a census of distinct development boards.

One existing Seeed **reSpeaker Lite Hardware Overview Front** PNG is truncated, including a fresh copy from its original URL. Its original bytes and source record are retained; the app reports that it cannot preview that source. It is not one of the 1,358 reviewed physical pinout images. See `data/catalog-build-report.json` for the exact file/hash.

Some diagrams are partial or low resolution; original revision/coverage notes are retained. Board identity and pin assignments have not been independently electrically verified. Manufacturer/source artwork keeps its original credit and rights records. No claim is made that every board ever manufactured is covered.

Windows desktop testing covers local catalog loading, image decoding, PDF rendering, original export hashes, saved-board persistence, renderer isolation and path restrictions. Browser tests cover search, filters, zoom, bookmarks, power tools, measurements, backup export and the narrow layout. Linux and macOS native launch validation remains a release task.
