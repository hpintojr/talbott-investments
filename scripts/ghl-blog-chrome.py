"""Build the tracking code that gives the GHL "Resources" blog (/blog815585 and /post/*) the new site's
look: header, footer, Insights hero and blog styling. Paste _blog_head.html and _blog_footer.html into the
blog site's head / body tracking code. Run after ghl-export.py."""
import base64, json, os, re

O = os.environ.get('GHL_OUT', 'ghl-export')
learn = open(f'{O}/learn.html').read()
header = learn[learn.find('<header'):learn.find('</header>') + 9]
footer = learn[learn.find('<footer'):learn.find('</footer>') + 9]
subscribe = re.search(r'<div class="hero-subscribe">.*?</div>', learn, re.S).group(0)
subscribe = re.sub(r'<script[^>]*></script>', '', subscribe)
art = re.search(r"--subpage-art:url\('([^']+)'\)", learn).group(1)
hero = (f'<main class="investor-page"><section class="subpage-hero has-hero-extra tb-blog-hero" style="--subpage-art:url(\'{art}\')">'
        '<div class="subpage-wrap"><p class="eyebrow">Insights</p><h1>Insights on Real Estate Investing</h1>'
        '<p>Practical articles on passive real estate investing, tax strategy, and market perspective from Stephen Predmore and the Talbott team.</p>'
        f'{subscribe}</div></section></main>')

# Old blog chrome: header nav, logo bar, "Resources" banner, old subscribe band, old footer.
OLD = ['ypcQfnkpkw', 'QOGJbbl7YU', 'saMNYFzIKd', 'D6-5nPIH0b', '0qfeiYWinq', 'RLVTdBS9z6', 'kNkCfEC_gC', 'KCX9v97mDt']
INK, NAVY, MUTED, LINE = '#232e4d', '#083965', '#667085', '#e3e7ee'
blog_css = (
    ','.join(f'#section-{s}' for s in OLD) + '{display:none!important}'
    'body{background:#fff}'
    '.tb-blog-chrome{position:relative;z-index:50}'
    '.tb-blog-chrome .approachable{padding-top:67px}'
    '.tb-blog-foot .approachable{padding-top:0}'
    '.tb-blog-hero{min-height:0!important;padding-block:clamp(56px,7vw,96px)!important}'
    # listing
    '.hl-blog-post-home{font-family:Arial,Helvetica,sans-serif!important}'
    'body .blog-post-wrapper-compact{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr))!important;gap:32px!important;width:100%!important;max-width:1000px!important;margin:clamp(40px,5vw,72px) auto 0!important;padding:0 clamp(16px,3vw,24px)!important;flex-direction:initial!important;flex-wrap:initial!important;align-content:start!important}'
    f'body .blog-post-wrapper-compact-list{{width:auto!important;max-width:none!important;margin:0!important;padding:0!important;background:#fff;border:1px solid {LINE};border-radius:14px;overflow:hidden;box-shadow:0 18px 40px -30px #232e4d66;transition:transform .2s ease,box-shadow .2s ease}}'
    'body .blog-post-wrapper-compact-list:hover{transform:translateY(-3px);box-shadow:0 24px 48px -28px #232e4d80}'
    'body .blog-compact-body-wrapper{padding:0!important;margin:0!important;height:100%!important}'
    'body .blog-compact-content{display:flex!important;flex-direction:column!important;gap:0!important;height:100%!important;justify-content:flex-start!important;align-items:stretch!important}'
    'body .blog-compact-content>div:last-child{order:-1!important}'
    '.hl-blog-post-home .text-xs{flex-wrap:wrap!important;gap:4px 14px!important}.hl-blog-post-home .blog-author,.hl-blog-post-home .blog-publish-date{white-space:nowrap;margin:0!important}'
    'body .blog-compact-content>div{width:100%!important;max-width:none!important;flex:none!important;margin:0!important}'
    'body .blog-image-compact-wrapper,body .blog-image-compact-wrapper>div{width:100%!important;max-width:none!important;height:auto!important;margin:0!important}'
    'body .blog-image-compact{width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:16/9;object-fit:cover!important;border-radius:0!important;display:block!important}'
    'body .content-width-compact{width:100%!important;max-width:none!important;padding:20px 22px 24px!important}'
    f'.hl-blog-post-home .blog-title,.hl-blog-post-home .blog-title a{{font-family:Arial,Helvetica,sans-serif!important;text-transform:none!important;color:{INK}!important;font-size:1.14rem!important;line-height:1.3!important;font-weight:700!important;letter-spacing:-.01em;margin:0 0 10px!important;text-decoration:none!important}}'
    f'.hl-blog-post-home .blog-author,.hl-blog-post-home .blog-publish-date{{font-family:Arial,Helvetica,sans-serif!important;color:{MUTED}!important;font-size:.78rem!important}}'
    f'.hl-blog-post-home .blog-description{{font-family:Arial,Helvetica,sans-serif!important;color:{MUTED}!important;font-size:.92rem!important;line-height:1.5!important;margin:10px 0 14px!important}}'
    f'.hl-blog-post-home .blog-button{{font-family:Arial,Helvetica,sans-serif!important;color:{NAVY}!important;font-weight:700!important;font-size:.9rem!important;text-decoration:none!important;display:inline-flex;align-items:center;gap:4px}}'
    f'.hl-blog-post-home .blog-button svg{{stroke:{NAVY}!important}}'
    '.hl-blog-post-home .pagination,.hl-blog-post-home nav[aria-label*="agination"]{margin:40px auto 72px!important}'
    f'.hl-blog-post-home button,.hl-blog-post-home .pagination a{{font-family:Arial,Helvetica,sans-serif!important;border-radius:8px!important;border-color:{LINE}!important;color:{INK}!important}}'
    # single post
    '.blog-html-container-single{max-width:780px!important;margin:clamp(36px,5vw,64px) auto 80px!important;padding:0 clamp(16px,3vw,24px)!important;font-family:Arial,Helvetica,sans-serif!important}'
    '.blog-cover-image-container img{border-radius:14px!important;width:100%!important;box-shadow:0 18px 40px -26px #232e4d80}'
    f'.blog-content-title{{font-family:Arial,Helvetica,sans-serif!important;color:{INK}!important;font-size:clamp(2rem,3.6vw,3rem)!important;line-height:1.08!important;letter-spacing:-.025em!important;font-weight:700!important;text-transform:none!important;margin:28px 0 14px!important}}'
    f'.blog-category a{{display:inline-block;background:#eef3f9;color:{NAVY}!important;border-radius:999px;padding:4px 12px;font-size:.72rem!important;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none!important}}'
    f'.blog-date,.blog-read-time,.blog-info-dot{{color:{MUTED}!important;font-size:.85rem!important}}'
    f'.blog-html{{color:#3b4562!important;font-size:1.06rem;line-height:1.75;margin-top:26px}}'
    f'.blog-html p,.blog-html li,.blog-html span{{font-family:Arial,Helvetica,sans-serif!important;color:#3b4562}}'
    f'.blog-html h1,.blog-html h2,.blog-html h3,.blog-html h4,.blog-html h2 span,.blog-html h3 span,.blog-html strong{{color:{INK}!important;font-family:Arial,Helvetica,sans-serif!important}}'
    '.blog-html h2{margin-top:1.6em!important;letter-spacing:-.015em}'
    f'.blog-html a{{color:{NAVY}!important;text-decoration:underline}}'
    '.blog-html img{border-radius:12px;max-width:100%;height:auto}'
    f'.blog-html .cta-button,.blog-html button{{background:{NAVY}!important;color:#fff!important;border:0!important;border-radius:8px!important;padding:12px 22px!important;font-weight:700!important;cursor:pointer}}'
    f'.blog-back-button,.blog-back-button *{{color:{NAVY}!important;font-family:Arial,Helvetica,sans-serif!important}}'
)

head = open(f'{O}/_head.html').read()
head_css = re.search(r'<style>(.*)</style>', head, re.S).group(1)
open(f'{O}/_blog_head.html', 'w').write(f'<style>{head_css}{blog_css}</style>')

inject = (
    "(function(){if(document.getElementById('tb-blog-top'))return;"
    f"var H={json.dumps(header)},F={json.dumps(footer)},R={json.dumps(hero)};"
    "var post=/^\\/post\\//.test(location.pathname);"
    "var top=document.createElement('div');top.id='tb-blog-top';top.className='ghl-site tb-blog-chrome';"
    "top.innerHTML='<div class=\"approachable has-scrolled past-hero\">'+H+(post?'':R)+'</div>';"
    "document.body.insertBefore(top,document.body.firstChild);"
    "var bot=document.createElement('div');bot.id='tb-blog-foot';bot.className='ghl-site tb-blog-chrome tb-blog-foot';"
    "bot.innerHTML='<div class=\"approachable\">'+F+'</div>';document.body.appendChild(bot);"
    "if(!post){var s=document.createElement('script');s.src='https://link.msgsndr.com/js/form_embed.js';s.defer=true;document.body.appendChild(s);}"
    # any remaining old-theme section that carries a nav menu (mobile variants) goes too
    "function hide(){document.querySelectorAll('#__nuxt .c-section').forEach(function(s){if(s.querySelector('.c-nav-menu,[class*=\"nav-menu\"]'))s.style.display='none'})}"
    "hide();addEventListener('load',hide);setTimeout(hide,1500);})();"
)
footer_js = open(f'{O}/_footer.html').read()
b64 = base64.b64encode(inject.encode()).decode()
open(f'{O}/_blog_footer.html', 'w').write(
    '<script>(new Function(decodeURIComponent(escape(atob("' + b64 + '")))))();</script>' + footer_js)
print('ok', len(head_css) + len(blog_css), len(inject))
