/* VA EN: un <script> nuevo justo ANTES de "</body>" (después de los <script> existentes). Ancla única: "</body>" */
/* D-vivo · Corona de plata encantada: un solo motor calcula la luz por zonas sobre la silueta de corona.webp
   (relieve sacado de su propia imagen) y cada adorno visible copia el cuadro; el siguiente va espejado.
   Además: luz que recorre la rueca y chispas de las tres hadas en el canvas #sparks (los pétalos los pone A-particulas.js). */
(function(){
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────── 1 · Corona viva (canvas en tiempo real) ───────── */
  var LUGARES = [
    ['.sec.locs', 'd-vivo--l'],
    ['.sec.itin', 'd-vivo--r'],
    ['#album', 'd-vivo--l']
  ];
  var S = 168, fuente = document.createElement('canvas');
  fuente.width = fuente.height = S;
  var fx = fuente.getContext('2d');
  var adornos = [];
  LUGARES.forEach(function(L, i){
    var sec = document.querySelector(L[0]);
    if (!sec) return;
    var w = document.createElement('i'), c = document.createElement('canvas');
    w.className = 'd-vivo ' + L[1];
    w.setAttribute('aria-hidden', 'true');
    w.style.setProperty('--d', (-i * 1.7).toFixed(1) + 's');
    c.width = c.height = S;
    w.appendChild(c);
    sec.appendChild(w);
    var x = c.getContext('2d');
    if (i % 2) x.setTransform(-1, 0, 0, 1, S, 0);
    adornos.push({ el: w, ctx: x, ve: false });
  });

  var img = new Image();
  img.decoding = 'async';
  img.onload = function(){
    if (!adornos.length) return;
    /* silueta centrada */
    var k = Math.min(S / img.width, S / img.height) * .92, w = img.width * k, h = img.height * k;
    fx.clearRect(0, 0, S, S);
    fx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
    var src = fx.getImageData(0, 0, S, S), D = src.data, N = S * S;
    var A = new Float32Array(N), Lm = new Float32Array(N), H = new Float32Array(N);
    for (var p = 0; p < N; p++){
      A[p] = D[p * 4 + 3] / 255;
      Lm[p] = (D[p * 4] * .3 + D[p * 4 + 1] * .55 + D[p * 4 + 2] * .15) / 255;
    }
    /* relieve: brillo propio + abombado hacia el interior de la silueta */
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++){
      var s = 0, n = 0;
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++){
        var xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= S || yy >= S) continue;
        var q = yy * S + xx; s += Lm[q] * .7 + A[q] * .55; n++;
      }
      H[y * S + x] = s / n;
    }
    var NX = new Float32Array(N), NY = new Float32Array(N), NZ = new Float32Array(N);
    for (y = 1; y < S - 1; y++) for (x = 1; x < S - 1; x++){
      var i = y * S + x;
      var gx = (H[i + 1] - H[i - 1]) * 3.2, gy = (H[i + S] - H[i - S]) * 3.2;
      var l = Math.sqrt(gx * gx + gy * gy + 1);
      NX[i] = -gx / l; NY[i] = -gy / l; NZ[i] = 1 / l;
    }
    var out = fx.createImageData(S, S), O = out.data;

    function pinta(t){
      /* luz que gira despacio alrededor (arriba-izquierda dominante) */
      var lx = -.45 + Math.cos(t) * .55, ly = -.55 + Math.sin(t * .8) * .3, lz = .7;
      var ll = Math.sqrt(lx * lx + ly * ly + lz * lz); lx /= ll; ly /= ll; lz /= ll;
      var hx = lx, hy = ly, hz = lz + 1, hl = Math.sqrt(hx * hx + hy * hy + hz * hz); hx /= hl; hy /= hl; hz /= hl;
      var fase = ((t * .23) % 1) * 2.6 - .8;          /* barrido diagonal de brillo */
      for (var i = 0; i < N; i++){
        var a = A[i];
        if (a < .02){ O[i * 4 + 3] = 0; continue; }
        var nx = NX[i], ny = NY[i], nz = NZ[i] || 1;
        var dif = nx * lx + ny * ly + nz * lz; if (dif < 0) dif = 0;
        var sp = nx * hx + ny * hy + nz * hz; sp = sp > 0 ? Math.pow(sp, 34) : 0;
        var x = (i % S) / S, y = ((i / S) | 0) / S;
        var b = (x + y) * .5 - fase; b = Math.exp(-b * b * 90) * .55;
        var lum = Lm[i];
        /* plata: base gris fría + rebote durazno en las sombras */
        var base = 70 + lum * 120;
        var sh = 1 - dif;
        var r = base * (.42 + .78 * dif) + sh * 34 + (sp * 1.15 + b) * 255;
        var g = base * (.42 + .78 * dif) + sh * 16 + (sp * 1.1 + b) * 240;
        var bl = base * (.46 + .8 * dif) + sh * 12 + (sp * 1.05 + b) * 236;
        O[i * 4] = r > 255 ? 255 : r;
        O[i * 4 + 1] = g > 255 ? 255 : g;
        O[i * 4 + 2] = bl > 255 ? 255 : bl;
        O[i * 4 + 3] = a * 255;
      }
      fx.putImageData(out, 0, 0);
    }
    function copia(todas){
      adornos.forEach(function(o){
        if (!todas && !o.ve) return;
        o.ctx.clearRect(0, 0, S, S);
        o.ctx.drawImage(fuente, 0, 0);
      });
    }
    var th = .9, raf = 0, last = 0, acum = 0;
    pinta(th); copia(true);
    if (RM || !('IntersectionObserver' in window)) return;
    function hay(){ return adornos.some(function(o){ return o.ve; }); }
    function loop(now){
      raf = 0;
      if (document.hidden || !hay()){ last = 0; return; }
      var dt = last ? Math.min((now - last) / 1000, .05) : .016;
      last = now; acum += dt;
      if (acum >= 1 / 30){ th += .55 * acum; acum = 0; pinta(th); copia(false); }
      raf = requestAnimationFrame(loop);
    }
    function arranca(){ if (!raf && !document.hidden && hay()) raf = requestAnimationFrame(loop); }
    var io = new IntersectionObserver(function(E){
      E.forEach(function(e){ adornos.forEach(function(o){ if (o.el === e.target) o.ve = e.isIntersecting; }); });
      arranca();
    }, { rootMargin: '60px 0px' });
    adornos.forEach(function(o){ io.observe(o.el); });
    document.addEventListener('visibilitychange', arranca);
  };
  img.src = 'corona.webp';

  /* ───────── 2 · Rueca: luz que recorre su silueta ───────── */
  var rq = document.getElementById('rueca');
  if (rq && !rq.querySelector('.d-rueca-luz')){
    var lz = document.createElement('i');
    lz.className = 'd-rueca-luz';
    lz.setAttribute('aria-hidden', 'true');
    rq.appendChild(lz);
  }

  /* ───────── 3 · #sparks: chispas de las tres hadas (rosa, azul, verde, suaves) ───────── */
  var cv = document.getElementById('sparks');
  if (!cv) return;
  var cx = cv.getContext('2d'), proto = CanvasRenderingContext2D.prototype;
  var MAPA = {
    '#ffd86b': '#bcd6ff',   /* Primavera · azul */
    '#ffa1dd': '#ffc6dc',   /* Flora · rosa */
    '#f7e7ce': '#c9efd6',   /* Fauna · verde */
    '#fff6c9': '#e6e8ee',   /* plata */
    '#ffd1e8': '#ffd9e6'
  };
  var propio = false;
  function remapa(nombre){
    var d = Object.getOwnPropertyDescriptor(proto, nombre);
    if (!d || !d.set) return;
    Object.defineProperty(cx, nombre, {
      configurable: true,
      get: function(){ return d.get.call(this); },
      set: function(v){ d.set.call(this, (!propio && typeof v === 'string' && MAPA[v.toLowerCase()]) || v); }
    });
  }
  remapa('fillStyle'); remapa('shadowColor');
  var dA = Object.getOwnPropertyDescriptor(proto, 'globalAlpha');
  if (dA && dA.set) Object.defineProperty(cx, 'globalAlpha', {
    configurable: true,
    get: function(){ return dA.get.call(this); },
    set: function(v){ dA.set.call(this, propio ? v : v * .62); }
  });

})();
