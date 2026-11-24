/* INSERTAR: antes del marcador AUDIO_JS de template.html (2º script). Toma el control de #wheel-ring: congela el IIFE viejo "rueda 3D" de main.js y clona el aro. build.py: quitar loading="lazy" de las .wheel-card img. */
(function(){
  var scene=document.getElementById('wheel-scene'),old=document.getElementById('wheel-ring');
  if(!scene||!old)return;
  try{old.dispatchEvent(new MouseEvent('mousedown',{cancelable:true,clientX:0}))}catch(e){}
  var ring=old.cloneNode(true);old.parentNode.replaceChild(ring,old);
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards=[].slice.call(ring.querySelectorAll('.wheel-card')),n=cards.length;if(!n)return;
  var cw=cards[0].offsetWidth||150,ch=cards[0].offsetHeight||210;
  var R=Math.round((cw+16)/(2*Math.sin(Math.PI/n)));
  cards.forEach(function(c,i){
    var im=c.querySelector('img');
    if(im){im.removeAttribute('loading');im.decoding='async'}
    var a=360/n*i,t='rotateY('+a+'deg) translateZ('+R+'px)';
    c.style.transform=t;
    var r=document.createElement('div');r.className='wheel-refl';r.setAttribute('aria-hidden','true');
    if(im)r.style.backgroundImage='url("'+(im.getAttribute('src')||im.src)+'")';
    r.style.transform=t+' translateY('+(ch+3)+'px) scaleY(-1)';
    ring.appendChild(r);
  });
  var rot=0,vel=0,drag=false,sx=0,lx=0,sr=0,moved=false,vis=false,lbOpen=false;
  var AUTO=RM?0:.14;
  function paint(){ring.style.transform='translateZ(-'+R+'px) rotateY('+rot+'deg)'}paint();
  var last=performance.now();
  function tick(){
    var now=performance.now(),f=Math.min(3,(now-last)/16.667);last=now;
    if(!vis||lbOpen||drag)return;
    rot+=(vel+AUTO)*f;vel*=Math.pow(.94,f);if(Math.abs(vel)<.02)vel=0;paint();
  }
  if(window.gsap&&gsap.ticker)gsap.ticker.add(tick);else(function l(){tick();requestAnimationFrame(l)})();
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;last=performance.now()},{threshold:0}).observe(scene);else vis=true;
  ring.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;drag=true;moved=false;sx=lx=e.clientX;sr=rot;vel=0;ring.classList.add('dragging')});
  window.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;rot=sr+dx*.45;vel=(e.clientX-lx)*.5;lx=e.clientX;paint()});
  function up(){if(!drag)return;drag=false;ring.classList.remove('dragging');last=performance.now()}
  window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  ring.addEventListener('dragstart',function(e){e.preventDefault()});
  /* lightbox: abre en click (no en pointerup) y no cierra por el click fantasma del mismo toque */
  var lb=document.createElement('div');lb.className='gl-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Foto ampliada');
  lb.innerHTML='<img alt=""><button class="gl-x" type="button" aria-label="Cerrar">&times;</button><button class="gl-p" type="button" aria-label="Anterior">&#8249;</button><button class="gl-n" type="button" aria-label="Siguiente">&#8250;</button>';
  document.body.appendChild(lb);
  var lbi=lb.querySelector('img'),cur=0,openedAt=0;
  function show(i){cur=(i+n)%n;var im=cards[cur].querySelector('img');lbi.src=im.currentSrc||im.src;lbi.alt=im.alt||''}
  function open(i){show(i);lb.classList.add('on');lbOpen=true;openedAt=performance.now()}
  function close(){if(performance.now()-openedAt<400)return;lb.classList.remove('on');lbOpen=false;last=performance.now()}
  ring.addEventListener('click',function(e){
    if(moved){moved=false;return}
    var c=e.target.closest&&e.target.closest('.wheel-card');if(!c)return;
    open(cards.indexOf(c));
  });
  lb.addEventListener('click',function(e){
    var t=e.target;
    if(t.classList.contains('gl-p')){show(cur-1);return}
    if(t.classList.contains('gl-n')){show(cur+1);return}
    close();
  });
  document.addEventListener('keydown',function(e){if(!lbOpen)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1)});
  var h=document.querySelector('#galeria .gal-hint');if(h)h.textContent='Arrastra para girar · toca para ampliar';
})();
