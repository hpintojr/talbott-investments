"""Mercury (Sulus Sites) export: one self-contained HTML fragment per page, plus the
site-wide stylesheet (Header slot) and script (Footer slot).

Differences from ghl-export.py:
- No {{custom_values.*}} tokens. Mercury websites do not read CRM custom values; the
  build already renders the snapshot values, so pages keep their real content.
- Brand colours and fonts read Mercury's Site Settings through its CSS variables
  (--app-color-primary, --app-color-secondary, --app-color-heading, --app-font-*), with
  Talbott's values as fallbacks. Changing Site Settings reskins every page.
- The firm name and company LinkedIn URL become {{site.name}} / {{site.social.linkedin}}.

Run:  GHL_EXPORT=1 OUT=ghl-dist node build.mjs && GHL_DIST=ghl-dist python3 scripts/mercury-export.py
"""
import json, re, os, sys, glob, html, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from css_scope import scope_css

S = os.path.dirname(os.path.abspath(__file__))
D = os.environ.get('GHL_DIST', 'ghl-dist')
O = os.environ.get('MERCURY_OUT', 'mercury-export')
os.makedirs(O, exist_ok=True)
media = json.load(open(f'{S}/ghl-media.json'))

FIRM = 'Talbott Investments'
LINKEDIN = 'https://www.linkedin.com/company/talbott-investments/'

# Site Settings -> CSS variables (fallback = Talbott value)
COLOR_VARS = {
    '#083965': 'var(--app-color-primary,#083965)',    # navy accent / buttons
    '#0b4a82': 'var(--app-color-secondary,#0b4a82)',  # accent hover
    '#232e4d': 'var(--app-color-heading,#232e4d)',    # ink / headings
}
FONT_VARS = {
    "'Red Hat Display', Arial, sans-serif": "var(--app-font-body,'Red Hat Display', Arial, sans-serif)",
    "'Inter Tight',Arial,sans-serif": "var(--app-font-heading,'Inter Tight',Arial,sans-serif)",
}

pages = sorted(glob.glob(f'{D}/**/index.html', recursive=True))
slugs = {os.path.relpath(os.path.dirname(p), D) for p in pages}


def mpath(rel):
    return '/' if rel == '.' else '/' + rel


def fix(t):
    for k, v in media.items():
        t = t.replace(f'/images/{k}', v)

    def rl(m):
        q, u = m.group(1), m.group(2)
        path, _, frag = u.partition('#')
        p = path.strip('/')
        if p == '':
            new = '/'
        elif p in slugs:
            new = mpath(p)
        else:
            return m.group(0)
        return f'href={q}{new}{"#" + frag if frag else ""}{q}'
    return re.sub(r'href=(["\'])(/[^"\'#]*(?:#[^"\']*)?)\1', rl, t)


def tokens(t):
    t = t.replace(LINKEDIN, '{{site.social.linkedin}}')
    return t.replace(FIRM, '{{site.name}}')


def brand_css(css):
    for k, v in COLOR_VARS.items():
        css = re.sub(re.escape(k) + r'(?![0-9a-fA-F])', v, css, flags=re.I)
    for k, v in FONT_VARS.items():
        css = css.replace(k, v)
    return css


manifest = []
for p in pages:
    rel = os.path.relpath(os.path.dirname(p), D)
    t = open(p).read()
    title = html.unescape(re.search(r'<title>(.*?)</title>', t, re.S).group(1))
    d = re.search(r'<meta name="description" content="(.*?)"', t)
    desc = html.unescape(d.group(1)) if d else ''
    bc = re.search(r'<body class="([^"]*)"', t).group(1)
    body = re.search(r'<body[^>]*>(.*)</body>', t, re.S).group(1)
    name = 'home' if rel == '.' else rel.replace('/', '-')
    frag = tokens(f'<div class="ghl-site"><div class="{bc}">{fix(body)}</div></div>')
    open(f'{O}/{name}.html', 'w').write(frag)
    manifest.append({'name': name, 'path': mpath(rel), 'slug': '' if rel == '.' else rel,
                     'title': tokens(title), 'description': tokens(desc), 'bytes': len(frag)})

css = scope_css(fix(open(f'{D}/site.css').read()), '.ghl-site')
css = brand_css(css)
# Let the HTML block run edge to edge inside Mercury's section/row/column wrappers.
css += ('.ghl-site{display:block;width:100%;text-align:left;margin:0;padding:0;background:#fff}'
        '.uk-section:has(.ghl-site),.uk-container:has(.ghl-site),.uk-grid:has(.ghl-site),'
        '.uk-grid:has(.ghl-site)>*{padding:0!important;margin:0!important;max-width:none!important;width:100%!important}')
open(f'{O}/_head.html', 'w').write(f'<style>{css}</style>')

js = open(f'{D}/site.js').read().replace("const page = document.body;",
                                         "const page = document.querySelector('.ghl-site > div') || document.body;")
navfix = ("(function(){function y(){var e=document.scrollingElement||document.documentElement;return Math.max(window.pageYOffset||0,e.scrollTop||0,document.body.scrollTop||0)}"
          "function t(){var r=document.querySelector('.ghl-site > div'),h=document.querySelector('.ghl-site .hero');if(!r||!h)return;"
          "r.classList.toggle('has-scrolled',y()>24);r.classList.toggle('past-hero',h.getBoundingClientRect().bottom<80)}"
          "document.addEventListener('scroll',t,{passive:true,capture:true});addEventListener('resize',t);addEventListener('load',t);t()})();")
code = navfix + fix(js)
b64 = base64.b64encode(code.encode('utf-8')).decode('ascii')
open(f'{O}/_footer.html', 'w').write('<script>(new Function(decodeURIComponent(escape(atob("' + b64 + '")))))();</script>')
json.dump(manifest, open(f'{O}/manifest.json', 'w'), indent=1)
for m in manifest:
    print(m['path'], m['bytes'], m['title'])
print('css', len(css), 'js', len(js))
