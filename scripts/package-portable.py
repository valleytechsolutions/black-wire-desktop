"""Create transferable Windows and source bundles without modifying the library."""
from pathlib import Path
import hashlib
import json
import os
import zipfile

root = Path(__file__).resolve().parent.parent
version = json.loads((root / 'package.json').read_text(encoding='utf-8'))['version']
release = Path(os.environ.get('BLACKWIRE_RELEASE_DIR', root / 'release'))
release.mkdir(exist_ok=True)
reports = []

def bundle(name, source, files, prefix):
    out = release / name
    with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=1, allowZip64=True, strict_timestamps=False) as archive:
        for file in files:
            archive.write(file, prefix + '/' + file.relative_to(source).as_posix())
    digest = hashlib.file_digest(out.open('rb'), 'sha256').hexdigest()
    record = {'file': out.name, 'bytes': out.stat().st_size, 'sha256': digest}
    reports.append(record)
    print(json.dumps(record), flush=True)

source_files = []
for name in ['src', 'electron', 'scripts', 'tests', 'build', 'public', 'library']:
    source_files.extend(p for p in (root / name).rglob('*') if p.is_file())
source_files.extend(root / name for name in ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'index.html', 'vite.config.js', 'playwright.config.js', '.gitignore', 'README.md'])
source_files.extend(p for p in (root / 'data').glob('*.json'))
source_files.extend(p for p in (root / 'data' / 'power-sources').glob('*.pdf') if p.stat().st_size)
bundle(f'Black-Wire-{version}-source-with-library.zip', root, sorted(set(source_files)), 'Black Wire App')
windows = release / 'win-unpacked'
bundle(f'Black-Wire-{version}-windows-x64.zip', windows, sorted(p for p in windows.rglob('*') if p.is_file()), 'Black Wire Technical Reference Guide')
(release / 'portable-bundles.json').write_text(json.dumps(reports, indent=2), encoding='utf-8')
