import json,re,os,sys,glob,html
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from css_scope import scope_css
S=os.path.dirname(os.path.abspath(__file__)); D=os.environ.get('GHL_DIST','ghl-dist'); O=os.environ.get('GHL_OUT','ghl-export')
os.makedirs(O,exist_ok=True)
media=json.load(open(f'{S}/ghl-media.json'))
cvals={k:v for k,v in json.load(open(f'{S}/ghl-custom-values.json')).items() if not k.startswith('_')}
pages=sorted(p for p in glob.glob(f'{D}/**/index.html',recursive=True))
slugs={os.path.relpath(os.path.dirname(p),D) for p in pages}
def ghlpath(rel): return '/' if rel=='.' else '/'+rel
def fix(t):
    for k,v in media.items(): t=t.replace(f'/images/{k}',v)
    # internal links -> GHL single-segment paths
    def rl(m):
        q,u=m.group(1),m.group(2)
        path,_,frag=u.partition('#')
        p=path.strip('/')
        if p=='' : new='/'
        elif p in slugs: new=ghlpath(p)
        else: return m.group(0)
        return f'href={q}{new}{"#"+frag if frag else ""}{q}'
    return re.sub(r'href=(["\'])(/[^"\'#]*(?:#[^"\']*)?)\1',rl,t)
def cv_tokens(t):
    # data-cv bindings -> GHL {{custom_values.key}} tokens, merged by GHL at render time
    T=lambda k:'{{custom_values.'+k+'}}'
    t=re.sub(r'(<[^>]*\sdata-cv="([^"]+)"[^>]*>)[^<]*(<)',lambda m:m.group(1)+T(m.group(2))+m.group(3),t)
    for a in ('src','href'):
        t=re.sub(r'\s'+a+r'="[^"]*"([^>]*?)\sdata-cv-'+a+r'="([^"]+)"',lambda m:' '+a+'="'+T(m.group(2))+'"'+m.group(1),t)
    t=re.sub(r'(?:\sposter="[^"]*")?(\sdata-cv-poster="([^"]+)")',lambda m:' poster="'+T(m.group(2))+'"',t)
    return t
manifest=[]
for p in pages:
    rel=os.path.relpath(os.path.dirname(p),D); t=open(p).read()
    title=re.search(r'<title>(.*?)</title>',t,re.S).group(1)
    d=re.search(r'<meta name="description" content="(.*?)"',t); desc=html.unescape(d.group(1)) if d else ''
    bc=re.search(r'<body class="([^"]*)"',t).group(1)
    body=re.search(r'<body[^>]*>(.*)</body>',t,re.S).group(1)
    name='home' if rel=='.' else rel.replace('/','-')
    for u,tok in cvals.get(name,{}).items(): body=body.replace(u,tok)
    body=cv_tokens(body)
    frag=f'<div class="ghl-site"><div class="{bc}">{fix(body)}</div></div>'
    open(f'{O}/{name}.html','w').write(frag)
    manifest.append({'name':name,'path':ghlpath(rel),'title':html.unescape(title),'description':desc,'bytes':len(frag)})
css=scope_css(fix(open(f'{D}/site.css').read()),'.ghl-site')+'.ghl-site{display:block;width:100%;text-align:left;margin:0;padding:0;--bg:#fff;--ink:#232e4d;background:#fff}'+'.c-section:has(.ghl-site),.c-row:has(.ghl-site),.c-column:has(.ghl-site){padding:0!important;margin:0!important;max-width:none!important}.c-row:has(.ghl-site)>.inner,.c-section:has(.ghl-site)>.inner{max-width:none!important;width:100%!important}'; js=open(f'{D}/site.js').read().replace("const page = document.body;","const page = document.querySelector('.ghl-site > div') || document.body;")
OG='https://talbott-investments.vercel.app/images/og-talbott.jpg'
og=f'<meta property="og:image" content="{OG}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Talbott Investments: Invest With Confidence"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{OG}">'
open(f'{O}/_head.html','w').write(og+f'<style>{css}</style>')
# Site-wide fallback: pages pasted before a nav/footer change still get the company LinkedIn icon
home=open(f'{D}/index.html').read()
def grab(pat):
    m=re.search(pat,home,re.S); return m.group(0) if m else ''
li_nav=grab(r'<a class="linkedin-link".*?</a>'); li_foot=grab(r'<div class="footer-socials">.*?</div>')
inject=("(function(){var N="+json.dumps(li_nav)+",F="+json.dumps(li_foot)+";"
  "document.querySelectorAll('.ghl-site a.button.portal').forEach(function(a){if(N&&!a.parentNode.querySelector('.linkedin-link'))a.insertAdjacentHTML('beforebegin',N)});"
  "document.querySelectorAll('.ghl-site a.footer-portal').forEach(function(a){if(F&&!a.parentNode.querySelector('.footer-socials'))a.insertAdjacentHTML('beforebegin',F)});})();")
# GHL injects this code after its own render and may re-render the page HTML, so the
# header state is re-derived from whatever .ghl-site root is live (matches site.js on Vercel).
navfix=("(function(){function y(){var e=document.scrollingElement||document.documentElement;return Math.max(window.pageYOffset||0,e.scrollTop||0,document.body.scrollTop||0)}"
  "function t(){var r=document.querySelector('.ghl-site > div'),h=document.querySelector('.ghl-site .hero');if(!r||!h)return;"
  "r.classList.toggle('has-scrolled',y()>24);r.classList.toggle('past-hero',h.getBoundingClientRect().bottom<80)}"
  "document.addEventListener('scroll',t,{passive:true,capture:true});addEventListener('resize',t);addEventListener('load',t);setInterval(t,300);t()})();")
open(f'{O}/_footer.html','w').write(f'<script>{inject}{navfix}{fix(js)}</script>')
json.dump(manifest,open(f'{O}/manifest.json','w'),indent=1)
for m in manifest: print(m['path'],m['bytes'],m['title'])
print('css',len(css),'js',len(js))
