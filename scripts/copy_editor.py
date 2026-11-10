import argparse, shutil
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--output',required=True)
a=p.parse_args()
source=Path(__file__).resolve().parents[1]/'assets'/'editor'
dest=Path(a.output).expanduser().resolve()
if dest.exists() and any(dest.iterdir()):
    p.error('Output must be empty; existing projects are never overwritten.')
shutil.copytree(source,dest,dirs_exist_ok=True,ignore=shutil.ignore_patterns('node_modules','.next','*.tsbuildinfo'))
print('Editor copied to',dest)
