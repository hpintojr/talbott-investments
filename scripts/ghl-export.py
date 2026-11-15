import json,re,os,sys,glob,html
S=os.path.dirname(os.path.abspath(__file__)); D=os.environ.get('GHL_DIST','ghl-dist'); O=os.environ.get('GHL_OUT','ghl-export')
os.makedirs(O,exist_ok=True)
media=json.load(open(f'{S}/ghl-media.json'))
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
manifest=[]
for p in pages:
    rel=os.path.relpath(os.path.dirname(p),D); t=open(p).read()
    title=re.search(r'<title>(.*?)</title>',t,re.S).group(1)
    d=re.search(r'<meta name="description" content="(.*?)"',t); desc=html.unescape(d.group(1)) if d else ''
    bc=re.search(r'<body class="([^"]*)"',t).group(1)
    body=re.search(r'<body[^>]*>(.*)</body>',t,re.S).group(1)
    frag=f'<div class="ghl-site {bc}">{fix(body)}</div>'
    name='home' if rel=='.' else rel.replace('/','-')
    open(f'{O}/{name}.html','w').write(frag)
    manifest.append({'name':name,'path':ghlpath(rel),'title':html.unescape(title),'description':desc,'bytes':len(frag)})
css=fix(open(f'{D}/site.css').read()); js=open(f'{D}/site.js').read()
open(f'{O}/_head.html','w').write(f'<style>{css}</style>')
open(f'{O}/_footer.html','w').write(f'<script>{fix(js)}</script>')
json.dump(manifest,open(f'{O}/manifest.json','w'),indent=1)
for m in manifest: print(m['path'],m['bytes'],m['title'])
print('css',len(css),'js',len(js))
