"""Check bundle CRCs, Linux execute bits, and catalog revisions; write release hashes."""
from pathlib import Path
import hashlib
import json
import os
import tarfile
import zipfile

root = Path(__file__).resolve().parent.parent
version = json.loads((root / 'package.json').read_text(encoding='utf-8'))['version']
release = Path(os.environ.get('BLACKWIRE_RELEASE_DIR', root / 'release'))
reports = []
for file in sorted(release.glob(f'Black-Wire-{version}-*')):
    if not file.is_file() or not (file.name.endswith('.zip') or file.name.endswith('.tar.gz')):
        continue
    catalog = None
    if file.name.endswith('.zip'):
        with zipfile.ZipFile(file) as archive:
            bad = archive.testzip()
            if bad:
                raise RuntimeError(f'CRC failed: {file.name}: {bad}')
            name = next(n for n in archive.namelist() if n.endswith('/library/catalog.json'))
            catalog = json.loads(archive.read(name))
    else:
        executable = False
        with tarfile.open(file, 'r:gz') as archive:
            for member in archive:
                if member.name.endswith('/black-wire-technical-reference-guide'):
                    assert member.mode & 0o111 == 0o111, 'Linux execute bits are missing'
                    executable = True
                if member.name.endswith('/resources/library/catalog.json'):
                    catalog = json.load(archive.extractfile(member))
            assert executable
    expected = json.loads((root / 'library/catalog.json').read_text(encoding='utf-8'))
    assert catalog['stats']['referenceEntries'] == expected['stats']['referenceEntries']
    assert catalog['stats']['physicalPinouts'] == expected['stats']['physicalPinouts']
    assert catalog.get('editionInfo') == expected.get('editionInfo')
    assert next(p['boardIds'] for p in catalog['power'] if p['id'] == 'espc5') == ['espressif-esp32-esp32-c5-devkitc-1-v1-2']
    with file.open('rb') as stream:
        sha = hashlib.file_digest(stream, 'sha256').hexdigest()
    result = {'file': file.name, 'bytes': file.stat().st_size, 'sha256': sha, 'archiveChecked': True}
    reports.append(result)
    print(json.dumps(result), flush=True)
(release / 'release-manifest.json').write_text(json.dumps(reports, indent=2), encoding='utf-8')
(release / 'SHA256SUMS.txt').write_text(''.join(f"{r['sha256']}  {r['file']}\n" for r in reports), encoding='utf-8')
