import re, io
BASE = 'C:/Users/aleja/boda-abigail-y-judith/index.html'
STD = 'C:/Users/aleja/xv-vanessa-std/index.html'
OMAR = 'C:/Users/aleja/boda-omar-y-cari/index.html'
OUT = 'C:/Users/aleja/xv-vanessa-aileen-de-la-rosa/index.html'
HERE = 'C:/Users/aleja/xv-vanessa-aileen-de-la-rosa/'

b = open(BASE, encoding='utf-8').read().split('\n')
std = open(STD, encoding='utf-8').read()
omar = open(OMAR, encoding='utf-8').read()
tpl = open(HERE + '_src/template.html', encoding='utf-8').read()

def lines(a, z):  # 1-indexed inclusive
    return '\n'.join(b[a - 1:z])

# ── LIBRO (de mi save the date)
m = re.search(r'/\* ============ LIBRO ============ \*/(.*?)/\* ============ SECCIONES', std, re.S)
libro_css = m.group(1)
m = re.search(r'(<div id="libro".*?</div>\s*</div>\s*<div class="tap">.*?</div>\s*</div>)', std, re.S)
libro_dom = ('<div id="libro" class="sobre"><img id="envImage" src="sobre.jpg" alt="Invitación XV Vanessa Aileen" fetchpriority="high">'
  '<video id="envVideo" src="sobre.mp4" muted playsinline preload="auto" poster="sobre.jpg"></video><div class="tap">TOCA PARA ABRIR</div></div>')
libro_css = '''
#libro{position:fixed;inset:0;z-index:50;background:#f6ebe4;cursor:pointer;transition:opacity 1.4s ease,visibility 1.4s}
#libro.gone{opacity:0;visibility:hidden}
#libro img,#libro video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#libro video{opacity:0;transition:opacity .35s}
#libro.play video{opacity:1}
#libro .tap{position:absolute;left:0;right:0;bottom:max(8vh,48px);text-align:center;font-family:'Cinzel',serif;font-weight:600;letter-spacing:.3em;font-size:.8rem;color:#fff;text-shadow:0 1px 8px rgba(110,40,64,.75);animation:tapPulse 2.2s ease-in-out infinite}
@keyframes tapPulse{50%{opacity:.45}}
'''
m = re.search(r'/\* música: corona \*/(.*?)@media \(prefers-reduced', std, re.S)
music_css = m.group(1)

# ── Base: RSVP / álbum
def fix_css(s):
    s = s.replace('#722f37', 'var(--deep)').replace('#ab5c5c', 'var(--accent)')
    s = s.replace("'Italiana',serif", "'Cinzel',serif")
    s = s.replace("font-size:11px", "font-size:13px").replace("font-size:12px", "font-size:13px")
    s = s.replace("font-family:'Great Vibes',cursive;font-size:clamp(32px,9vw,46px)", "font-family:'Cinzel Decorative',serif;font-weight:700;font-size:clamp(24px,7vw,32px)")
    s = s.replace("font-family:'Great Vibes',cursive;font-size:clamp(36px,9vw,48px)", "font-family:'Cinzel',serif;font-weight:600;font-size:clamp(32px,8vw,40px)")
    s = s.replace("font-family:'Great Vibes',cursive;font-size:26px", "font-family:'Cormorant Garamond',serif;font-weight:700;font-size:24px")
    s = s.replace("font-family:'Great Vibes',cursive;font-size:36px", "font-family:'Cinzel Decorative',serif;font-weight:700;font-size:26px")
    s = s.replace("font-family:'Great Vibes',cursive;font-size:56px", "font-family:'Cinzel Decorative',serif;font-weight:700;font-size:30px")
    s = s.replace("font-size:clamp(15px,1.5vw,17px)", "font-size:18px").replace("opacity:.8}", "opacity:.92}")
    return s

rsvp_css = fix_css(lines(217, 268))
rsvp_css = rsvp_css.replace('#rsvp-section{position:relative;overflow:hidden;padding:min(11vh,88px) 32px}',
    '#rsvp-section{position:relative;overflow:hidden;padding:min(11vh,88px) 22px;background:linear-gradient(180deg,var(--surface),#fdebe6)}')
album_css = fix_css(lines(190, 203))
album_css = album_css.replace('#album{background:var(--surface);text-align:center}', '#album{background:var(--bg);text-align:center}')

rsvp_html = lines(528, 591)
rsvp_html = rsvp_html.replace('Confirma antes del 1 de Octubre · 2026', 'Confirma antes del 31 de Diciembre · 2026')
rsvp_html = rsvp_html.replace('¡Nos vemos en Mazatlán!', '¡Nos vemos en mis XV años!')
rsvp_html = rsvp_html.replace('✨', '✦')
rsvp_html = rsvp_html.replace('para que podamos preparar todo con amor para este día tan especial.', 'para que podamos preparar todo con mucho cariño para mis XV años.')

album_html = lines(594, 617)
album_html = album_html.replace('data-fecha="2026-10-24"', 'data-fecha="2027-01-16"')
album_html = album_html.replace('panel-invitados.vercel.app/subir/abigail-y-judith', 'panel-invitados.vercel.app/subir/xv-vanessa-aileen-de-la-rosa')
album_html = album_html.replace(' ✨', '')
album_html = re.sub(r'<h2 class="heading">Álbum de fotos</h2>', '<h2 class="heading">Álbum de fotos</h2>', album_html)

rsvp_js = lines(804, 1040)
rsvp_js = rsvp_js.replace("https://boda-abigail-y-judith.vercel.app", "https://xv-vanessa-aileen-de-la-rosa.vercel.app")
rsvp_js = rsvp_js.replace("new Date(2026, 9, 1, 23, 59, 59, 999);   /* 1 oct 2026 */", "new Date(2026, 11, 31, 23, 59, 59, 999);   /* 31 dic 2026 */")
assert '2026, 11, 31' in rsvp_js and 'xv-vanessa-aileen' in rsvp_js

audio_js = lines(1055, 1092)
audio_js = audio_js.replace("'https://boda-isaac-y-claudia.vercel.app/cancion.mp3'", "'https://boda-isaac-y-claudia.vercel.app/cancion.mp3'")
audio_js = '/* ELYSIUM AUDIO v2 */\n(function(){' + audio_js.split('(function(){', 1)[1] if False else lines(1049, 1093)
audio_js = audio_js.replace('<script>', '').replace('</script>', '')

# ── símbolos
church = re.search(r'<svg[^>]*>(.*)</svg>', open(HERE + 'church.svg', encoding='utf-8').read(), re.S).group(1)
couple = re.search(r'<svg[^>]*>(.*)</svg>', open(HERE + 'couple.svg', encoding='utf-8').read(), re.S).group(1)
gift = re.search(r'<symbol id="ic-gift"[^>]*>(.*?)</symbol>', omar, re.S).group(1)

# ── imágenes
order_arco = list(range(1, 19))
arco = ''.join('<img class="ft%s" src="vanessa-%d.webp" alt="Vanessa Aileen, foto %d" decoding="async"%s>' % (' on' if i == 0 else '', n, i + 1, '' if i == 0 else ' loading="lazy"') for i, n in enumerate(order_arco))
wheel_order = [1, 3, 5, 7, 9, 11, 13, 15, 17, 2, 6, 10, 14, 18]
wheel = ''.join('<div class="wheel-card"><img src="vanessa-%d.webp" alt="Vanessa Aileen" loading="lazy"></div>' % n for n in wheel_order)

music_dom = ('<audio id="bg-music" src="https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/audio/xv-vanessa-aileen-de-la-rosa/cancion.mp3" preload="none" loop></audio>\n'
             '<button id="music-btn" aria-label="Reproducir o pausar música"><img src="corona.webp" alt=""><span class="hint">PLAY</span></button>')

main_js = open(HERE + '_src/main.js', encoding='utf-8').read().replace('/*RSVP_JS*/', rsvp_js)

out = tpl
out = out.replace('/*LIBRO_CSS*/', libro_css).replace('<!--LIBRO_DOM-->', libro_dom)
out = out.replace('/*MUSIC_CSS*/', music_css).replace('<!--MUSIC_DOM-->', music_dom)
out = out.replace('/*RSVP_CSS*/', rsvp_css).replace('/*ALBUM_CSS*/', album_css)
out = out.replace('<!--RSVP_HTML-->', rsvp_html).replace('<!--ALBUM_HTML-->', album_html)
out = out.replace('<!--CHURCH_PATH-->', church).replace('<!--COUPLE_PATH-->', couple)
out = out.replace('<symbol id="ic-couple"', '<symbol id="ic-gift" viewBox="172.99 4329.27 91.45 102.89">' + gift + '</symbol>\n  <symbol id="ic-couple"')
out = out.replace('<!--ARCO_IMGS-->', arco).replace('<!--WHEEL_CARDS-->', wheel)
out = out.replace('/*MAIN_JS*/', main_js).replace('/*AUDIO_JS*/', audio_js)
open(OUT, 'w', encoding='utf-8').write(out)
print(len(out), 'bytes')

# ══ PAQUETE PREMIUM: integra _src/bloques/ sobre el index generado ══
import glob, os
B = HERE + '_src/bloques/'
def body(f):
    return open(f, encoding='utf-8').read().split('\n', 1)[1]
html = open(OUT, encoding='utf-8').read()
# CSS: antes del último </style>
css = '\n'.join(body(f) for f in sorted(glob.glob(B + '*.css')))
i = html.rfind('</style>'); html = html[:i] + css + '\n' + html[i:]
# HTML
a = html.index('<!-- DRESS CODE -->'); z = html.index('<!-- GALERÍA — RUEDA 3D -->')
html = html[:a] + body(B + 'C-dresscode.html') + '\n  ' + html[z:]
a = html.index('<section id="rsvp-section"'); z = html.index('<section id="album"')
html = html[:a] + body(B + 'C-rsvp.html') + '\n  ' + html[z:]
a = html.index('<audio id="bg-music"'); html = html[:a] + body(B + 'P-principal.html') + '\n' + html[a:]
# JS: los de AUDIO_JS en script propio tras el principal; los de </body> al final
js1 = ''.join('<script>\n' + body(B + f) + '\n</script>\n' for f in ['C-galeria.js', 'C-rsvp.js', 'P-principal.js'])
js2 = ''.join('<script>\n' + body(B + f) + '\n</script>\n' for f in ['A-capas.js', 'A-particulas.js', 'D-vivo.js', 'D-brillo.js', 'D-itinerario.js', 'S-ligero.js'])
i = html.rfind('</body>'); html = html[:i] + js1 + js2 + html[i:]
html = html.replace('loading="lazy"></div>', '></div>')
open(OUT, 'w', encoding='utf-8').write(html)
print('premium', len(html))
