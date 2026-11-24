"""Renderiza destellos de lente con alfa: se animan solo con transform y opacity."""
import numpy as np
from PIL import Image

A = 'C:/Users/aleja/xv-vanessa-aileen-de-la-rosa/assets/'
BLANCO = np.array([1, 1, 1.])
ROSA = np.array([1, .78, .70])
PERLA = np.array([.92, .90, .90])
CHAMP = np.array([.97, .91, .84])


def rejilla(n):
    c = (n - 1) / 2
    y, x = np.mgrid[0:n, 0:n]
    return (x - c) * 512 / n, (y - c) * 512 / n


def rayo(u, v, ancho, largo):
    return np.exp(-(v / ancho) ** 2) * np.exp(-np.abs(u) / largo)


def guarda(rgb, nombre, n):
    rgb = 1 - np.exp(-rgb * 1.5)  # curva de película: el centro no se quema en plano
    borde = np.clip((256 - np.hypot(*rejilla(n))) / 44, 0, 1)
    rgb *= (borde * borde * (3 - 2 * borde))[..., None]
    al = rgb.max(2)
    col = rgb / np.maximum(al[..., None], .004)
    im = np.dstack([col, al])
    Image.fromarray((im.clip(0, 1) * 255 + .5).astype('uint8'), 'RGBA').save(A + nombre + '.webp', lossless=False, quality=88, alpha_quality=95, method=6)


n = 420
x, y = rejilla(n)
r = np.hypot(x, y)
u, v = (x + y) / np.sqrt(2), (x - y) / np.sqrt(2)
rgb = (np.exp(-(r / 6.5) ** 2) * 3.2)[..., None] * BLANCO
rgb += (np.exp(-r / 15) * .75)[..., None] * PERLA
rgb += (np.exp(-r / 48) * .24)[..., None] * ROSA
rgb += (rayo(x, y, 1.25, 92) * 1.15)[..., None] * PERLA          # anamórfico
rgb += (rayo(x, y, 5.5, 62) * .13)[..., None] * ROSA              # velo del anamórfico
rgb += (rayo(y, x, 1.05, 38) * .95)[..., None] * BLANCO
rgb += (rayo(u, v, .8, 15) * .42)[..., None] * CHAMP
rgb += (rayo(v, u, .8, 15) * .42)[..., None] * CHAMP
rgb += (np.exp(-((r - 74) / 3.2) ** 2) * .035)[..., None] * ROSA  # halo de lente
for gx, gr, ga in ((-112, 8, .05), (92, 5, .06), (150, 11, .03)):  # fantasmas sobre el eje
    rgb += (np.exp(-(np.hypot(x - gx, y) / gr) ** 4) * ga)[..., None] * ROSA
guarda(rgb, 'flare', n)

n = 150
x, y = rejilla(n)
r = np.hypot(x, y)
u, v = (x + y) / np.sqrt(2), (x - y) / np.sqrt(2)
rgb = (np.exp(-(r / 17) ** 2) * 3)[..., None] * BLANCO
rgb += (np.exp(-r / 42) * .5)[..., None] * PERLA
rgb += (rayo(x, y, 3.4, 62) * 1.25)[..., None] * BLANCO
rgb += (rayo(y, x, 3.4, 62) * 1.25)[..., None] * BLANCO
rgb += (rayo(u, v, 2.2, 24) * .45)[..., None] * CHAMP
rgb += (rayo(v, u, 2.2, 24) * .45)[..., None] * CHAMP
guarda(rgb, 'flare-mini', n)

