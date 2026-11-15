"""Prefix every selector in a stylesheet with a scope, so the site CSS cannot leak into GHL's own markup."""
import re

def split_top(s, ch=','):
    out, depth, cur = [], 0, ''
    for c in s:
        if c in '([': depth += 1
        elif c in ')]': depth -= 1
        if c == ch and depth == 0:
            out.append(cur); cur = ''
        else:
            cur += c
    out.append(cur)
    return out

def scope_sel(sel, scope):
    s = sel.strip()
    if not s: return s
    m = re.match(r'^(html|body|:root)\b(.*)$', s)
    if m:
        rest = m.group(2).strip()
        return f'{scope}{(" " + rest) if rest and not rest.startswith(("[", ":", ".")) else rest}' if rest else scope
    return f'{scope} {s}'

def scope_css(css, scope):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: out.append(css[i:]); break
        head = css[i:j].strip()
        # find matching brace
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        body = css[j+1:k-1]
        if head.startswith('@'):
            if re.match(r'@(media|supports|container|layer)\b', head):
                out.append(f'{head}{{{scope_css(body, scope)}}}')
            else:
                out.append(f'{head}{{{body}}}')
        else:
            sels = ','.join(scope_sel(s, scope) for s in split_top(head))
            out.append(f'{sels}{{{body}}}')
        i = k
    return ''.join(out)
