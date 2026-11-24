/* VA EN: un <script> nuevo justo ANTES de "</body>" (después de los <script> existentes). Ancla única: "</body>" */
/* D-brillo · plata con toque durazno: destellos de lente (renderizados aquí mismo en canvas),
   filos de luz en tarjetas, foil en títulos y cifras, filo de cromo en botones. */
(function(){
  var raiz = document.documentElement;

  /* ── Destellos: se pintan una vez y se usan como imagen ── */
  function hazFlare(n, claro, mini){
    var c = document.createElement('canvas'); c.width = c.height = n;
    var x = c.getContext('2d'), m = n / 2;
    x.globalCompositeOperation = 'lighter';
    function rad(r, stops){ var g = x.createRadialGradient(m, m, 0, m, m, r); stops.forEach(function(s){ g.addColorStop(s[0], s[1]); }); x.fillStyle = g; x.fillRect(0, 0, n, n); }
    function rayo(ang, largo, grueso, col){
      x.save(); x.translate(m, m); x.rotate(ang);
      var g = x.createLinearGradient(-largo, 0, largo, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, largo, grueso, 0, 0, 6.2832); x.fill(); x.restore();
    }
    /* en fondo claro el halo lleva plata oscura y durazno para que se lea (nunca blanco sobre blanco) */
    var halo = claro ? 'rgba(150,146,160,.55)' : 'rgba(255,236,226,.45)';
    var duraz = claro ? 'rgba(231,150,128,.5)' : 'rgba(255,205,185,.4)';
    rad(m * (mini ? .5 : .42), [[0, halo], [.5, duraz.replace(/[\d.]+\)$/, '.18)')], [1, 'rgba(0,0,0,0)']]);
    rayo(0, m * .98, n * (mini ? .028 : .012), claro ? 'rgba(170,168,182,.95)' : 'rgba(255,248,242,.95)');
    rayo(Math.PI / 2, m * (mini ? .98 : .5), n * (mini ? .028 : .01), claro ? 'rgba(170,168,182,.85)' : 'rgba(255,255,255,.9)');
    rayo(Math.PI / 4, m * .3, n * .008, duraz);
    rayo(-Math.PI / 4, m * .3, n * .008, duraz);
    if (!mini){ x.globalAlpha = .5; rayo(0, m * .7, n * .05, duraz); x.globalAlpha = 1; }
    x.globalCompositeOperation = 'source-over';
    rad(n * (mini ? .1 : .045), [[0, '#fff'], [.45, claro ? 'rgba(244,244,250,.95)' : 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]);
    if (claro){ x.globalCompositeOperation = 'destination-over'; rad(n * .07, [[0, 'rgba(120,112,128,.45)'], [1, 'rgba(120,112,128,0)']]); }
    return 'url(' + c.toDataURL('image/png') + ')';
  }
  raiz.style.setProperty('--d-flare', hazFlare(300, true));
  raiz.style.setProperty('--d-flare-osc', hazFlare(300, false));
  raiz.style.setProperty('--d-flare-mini', hazFlare(110, true, true));
  raiz.style.setProperty('--d-flare-mini-osc', hazFlare(110, false, true));

  var n = 0;
  function flare(padre, x, y, s, mini, cls){
    var f = document.createElement('i'), b = document.createElement('b');
    f.className = 'd-flare' + (mini ? ' is-mini' : '') + (cls ? ' ' + cls : '');
    f.setAttribute('aria-hidden', 'true');
    f.style.setProperty('--x', x); f.style.setProperty('--y', y); f.style.setProperty('--s', s || 1);
    var dur = mini ? 5.5 + (n % 3) * .9 : 8 + (n % 3);
    f.style.setProperty('--dur', dur + 's');
    f.style.setProperty('--del', (-((n * .618034) % 1) * dur).toFixed(2) + 's');   /* desfase áureo */
    f.appendChild(b); padre.appendChild(f); n++;
    return f;
  }
  function osc(el){ return !!el.closest('.cd,#regalos,#footer,#hero'); }

  /* ── Tarjetas ── */
  document.querySelectorAll('.loc-card,.fam-box,.rsvp-card,.gift-opt,.album-qr').forEach(function(c, k){
    if (c.querySelector(':scope > .d-rim')) return;
    c.classList.add('d-card');
    if (osc(c)) c.classList.add('d-card--osc');
    if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
    ['d-halo', 'd-sheen', 'd-rim'].forEach(function(cl){
      var e = document.createElement('i'); e.className = cl; e.setAttribute('aria-hidden', 'true');
      if (cl !== 'd-halo'){ var h = document.createElement('i'); h.style.setProperty('--del', (-(k * 3.1)).toFixed(1) + 's'); e.appendChild(h); }
      c.insertBefore(e, c.firstChild);
    });
    var o = osc(c), chica = c.classList.contains('album-qr');
    flare(c, '7%', '0', chica ? .5 : .95, false, o ? 'is-osc' : '');
    if (!chica) flare(c, '90%', '100%', .6, false, o ? 'is-osc' : '');
  });

  /* ── Foil en títulos, nombres y cifras ── */
  var TIT = '.heading,.heading-sm,.arco-name,.loc-ttl,.footer-names,.hero-name,.rsvp-title,.gift-bank-name,.cd h2';
  var titulos = [].slice.call(document.querySelectorAll(TIT));
  titulos.forEach(function(t, i){
    t.classList.add('d-foil');
    if (osc(t)) t.classList.add('d-foil--osc');
    t.style.setProperty('--fd', (-(i * 1.37) % 7).toFixed(2) + 's');
  });
  document.querySelectorAll('.cd-num').forEach(function(t, i){
    t.classList.add('d-foil', 'd-foil--osc', 'd-foil--num');
    t.style.setProperty('--fd', (-i * 1.1).toFixed(2) + 's');
  });

  /* destello sobre la primera letra y mini al final; polvo de luz en los títulos principales */
  var capas = [];
  titulos.forEach(function(t){
    if (t.matches('.loc-ttl,.gift-bank-name')) return;
    var cap = document.createElement('span');
    cap.className = 'd-tcapa'; cap.setAttribute('aria-hidden', 'true');
    var o = osc(t) ? 'is-osc' : '';
    var a = flare(cap, '0', '0', t.matches('.hero-name,.heading') ? .42 : .34, false, o);
    var z = flare(cap, '0', '0', .8, true, o);
    var polvo = [];
    if (t.matches('.heading')) for (var j = 0; j < 3; j++) polvo.push(flare(cap, '0', '0', .38 + j * .08, true, o));
    var host = t.parentNode;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.insertBefore(cap, t.nextSibling);
    capas.push({ t: t, cap: cap, a: a, z: z, polvo: polvo });
  });
  function coloca(){
    capas.forEach(function(c){
      var t = c.t, host = c.cap.parentNode, hb = host.getBoundingClientRect();
      var rg = document.createRange(), rr = t.getBoundingClientRect();
      var izq = rr.left, der = rr.right, top = rr.top, alto = rr.height;
      try {
        rg.selectNodeContents(t);
        var rs = rg.getClientRects();
        if (rs.length){ izq = rs[0].left; top = rs[0].top; alto = rs[0].height; der = rs[rs.length - 1].right; var ult = rs[rs.length - 1]; c.zy = ult.top + ult.height * .3; }
      } catch (e){}
      c.a.style.setProperty('--x', (izq - hb.left + alto * .28).toFixed(1) + 'px');
      c.a.style.setProperty('--y', (top - hb.top + alto * .3).toFixed(1) + 'px');
      c.z.style.setProperty('--x', (der - hb.left - alto * .12).toFixed(1) + 'px');
      c.z.style.setProperty('--y', ((c.zy || top + alto * .3) - hb.top).toFixed(1) + 'px');
      c.polvo.forEach(function(p, j){
        var px = izq + (der - izq) * [.32, .62, .86][j], py = top + (j % 2 ? -alto * .12 : alto * 1.02);
        p.style.setProperty('--x', (px - hb.left).toFixed(1) + 'px');
        p.style.setProperty('--y', (py - hb.top).toFixed(1) + 'px');
      });
    });
  }
  coloca();
  addEventListener('load', coloca);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(coloca);
  var rz; addEventListener('resize', function(){ clearTimeout(rz); rz = setTimeout(coloca, 150); });

  /* ── Detalles: destellos donde la luz pegaría de verdad ── */
  var rq = document.getElementById('rueca');
  if (rq){ var fl = document.createElement('div'); fl.className = 'd-float'; rq.appendChild(fl);
    [['50%', '9%', .5, 0], ['26%', '44%', .9, 1], ['72%', '58%', .8, 1]].forEach(function(p){ flare(fl, p[0], p[1], p[2], !!p[3]); }); }
  var arco = document.querySelector('.arco');
  if (arco && arco.parentNode){ var ar = arco.parentNode; if (getComputedStyle(ar).position === 'static') ar.style.position = 'relative';
    var fa = document.createElement('div'); fa.className = 'd-arco-fl'; ar.insertBefore(fa, arco.nextSibling);
    flare(fa, '50%', '0', .5); flare(fa, '8%', '42%', .9, true); flare(fa, '92%', '70%', .8, true); }
  var seal = document.querySelector('.hero-seal');
  if (seal){ flare(seal, '50%', '-14px', .9, true, 'is-osc'); flare(seal, '86%', '18%', .7, true, 'is-osc'); }
})();
