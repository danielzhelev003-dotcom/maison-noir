"""Build the sample pages: inline the product drawings, write a full page for the repo
and a body-only fragment for the claude.ai artifact (which adds its own document wrapper)."""
import pathlib, re, sys

here = pathlib.Path(__file__).parent
symbols = (here / 'src' / 'symbols.svg').read_text()
out_fragments = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None

for src in sorted((here / 'src').glob('*.html')):
    fragment = src.read_text().replace('<!--SYMBOLS-->', symbols)
    title = re.search(r'<title>.*?</title>', fragment).group(0)
    page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + fragment.replace(title, title, 1) + '\n</html>\n')
    (here / src.name).write_text(page)
    if out_fragments:
        (out_fragments / f'sample-{src.name}').write_text(fragment)
    print('built', src.name)
