"""Preserve upstream Unix modes when archiving Linux builds on Windows."""
from pathlib import Path
import json
import os
import tarfile
import zipfile

root = Path(__file__).resolve().parent.parent
version = json.loads((root / 'package.json').read_text(encoding='utf-8'))['version']
release = Path(os.environ.get('BLACKWIRE_RELEASE_DIR', root / 'release'))
cache = Path(os.environ.get('LOCALAPPDATA', '')) / 'electron' / 'Cache'
for arch, directory in [('x64', 'linux-unpacked'), ('arm64', 'linux-arm64-unpacked')]:
    runtime = next(cache.rglob(f'electron-v44.4.5-linux-{arch}.zip'))
    with zipfile.ZipFile(runtime) as upstream:
        modes = {m.filename.rstrip('/'): (m.external_attr >> 16) & 0o7777 for m in upstream.infolist()}
    prefix = f'Black-Wire-{version}-linux-{arch}'
    output = release / (prefix + '.tar.gz')
    temporary = output.with_suffix('.gz.tmp')
    def permissions(member):
        relative = member.name[len(prefix):].lstrip('/')
        original = 'electron' if relative == 'black-wire-technical-reference-guide' else relative
        member.mode = modes.get(original) or (0o755 if member.isdir() else 0o644)
        member.uid = member.gid = 0
        member.uname = member.gname = ''
        return member
    with tarfile.open(temporary, 'w:gz', compresslevel=1) as archive:
        archive.add(release / directory, arcname=prefix, filter=permissions)
    temporary.replace(output)
    print(json.dumps({'file': output.name, 'bytes': output.stat().st_size, 'executableMode': oct(modes['electron']), 'sandboxMode': oct(modes['chrome-sandbox'])}), flush=True)
