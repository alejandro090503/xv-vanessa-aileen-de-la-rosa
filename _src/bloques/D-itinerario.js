/* VA EN: un <script> nuevo justo ANTES de "</body>" (después de los <script> existentes). Ancla única: "</body>" */
/* D-itinerario · horas en Bodoni Moda y estela de luz de plata guiada por el scroll */
(function(){
  var list = document.querySelector('.itin .itin-list');
  if (!list || list.dataset.luz) return;
  list.dataset.luz = '1';
  if (!document.querySelector('link[href*="Bodoni+Moda"]')){
    var lk = document.createElement('link'); lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;1,6..96,500&display=swap';
    document.head.appendChild(lk);
  }
  var items = [].slice.call(list.querySelectorAll('.itin-item'));
  list.querySelectorAll('.itin-time').forEach(function(h){
    var t = h.textContent.trim(), m = t.match(/^(\S+)\s+(.+)$/);
    if (!m) return;
    h.setAttribute('aria-label', t);
    h.innerHTML = '<span class="d-it-n"></span><span class="d-it-m"></span>';
    h.firstChild.textContent = m[1]; h.lastChild.textContent = m[2];
  });
  list.classList.add('d-itin');
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM){ items.forEach(function(r){ r.classList.add('is-lit'); }); list.style.setProperty('--d-p', 1); return; }

  function capa(cl){ var e = document.createElement('i'); e.className = cl; e.setAttribute('aria-hidden', 'true'); list.appendChild(e); return e; }
  var linea = capa('d-it-linea'), c1 = capa('d-it-t1'), c2 = capa('d-it-t2'), c3 = capa('d-it-t3'), head = capa('d-it-head');
  head.appendChild(document.createElement('b'));
  var colas = [[c1, 118], [c2, 74], [c3, 34]];

  var meta = 0, p = -1, raf = 0, last = 0, dir = 1, H = 1, hitos = [];
  function mide(){
    H = list.offsetHeight || 1;
    hitos = items.map(function(r){ var d = r.querySelector('.itin-dot'); return ((r.offsetTop + (d ? d.offsetTop + 5 : 20)) / H); });
  }
  function calcMeta(){
    var r = list.getBoundingClientRect(), vh = innerHeight;
    meta = Math.max(0, Math.min(1, (vh * .78 - r.top) / (r.height + vh * .2)));
  }
  function pinta(vel){
    var y = p * H;
    linea.style.height = y.toFixed(1) + 'px';
    colas.forEach(function(c){ var L = Math.min(y, c[1]); c[0].style.transform = 'translate3d(-50%,' + (y - L).toFixed(1) + 'px,0)'; c[0].style.height = L.toFixed(1) + 'px'; c[0].style.opacity = p > .002 ? 1 : 0; });
    var esc = .8 + Math.min(.42, Math.abs(vel) * 7);
    head.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) rotate(' + (dir > 0 ? 0 : 180) + 'deg) scale(' + esc.toFixed(3) + ')';
    head.classList.toggle('is-on', p > .003);
    items.forEach(function(r, i){ r.classList.toggle('is-lit', p > .001 && p >= (hitos[i] || 0) - .006); });
  }
  function loop(now){
    raf = 0;
    var dt = last ? Math.min((now - last) / 1000, .05) : .016;
    last = now;
    var dv = meta - p;
    if (Math.abs(dv) > .0004) dir = dv > 0 ? 1 : -1;
    p += dv * (1 - Math.exp(-dt / .17));   /* sigue al scroll con leve retraso */
    var quieto = Math.abs(meta - p) < .0005;
    if (quieto) p = meta;
    pinta(quieto ? 0 : dv);
    if (!quieto) raf = requestAnimationFrame(loop); else last = 0;
  }
  function kick(){ calcMeta(); if (p < 0) p = meta; if (!raf) raf = requestAnimationFrame(loop); }
  mide(); calcMeta(); p = 0; pinta(0);
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', function(){ mide(); kick(); });
  addEventListener('load', function(){ mide(); kick(); });
})();
