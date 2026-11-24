/* INSERTAR: antes de /*AUDIO_JS*/ */
(function(){
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* ids para el menú */
  [['.intro','s-intro'],['.retrato','s-retrato'],['.cd','s-cd'],['.locs','s-locs'],['.itin','s-itin'],['.dress','s-dress']].forEach(function(p){var e=document.querySelector(p[0]);if(e&&!e.id)e.id=p[1]});
  var fam=document.querySelector('.fam-box');if(fam){var s=fam.closest('section');if(s&&!s.id)s.id='s-familia'}

  /* fundidos de secciones con color propio */
  function initSectionFades(){
    var bg=getComputedStyle(document.querySelector('.wrap')).backgroundColor;
    function rgb(c){var m=c.match(/[\d.]+/g);return m?m.slice(0,3).map(Number):[255,252,248]}
    function ramp(col,dir){var st=[];for(var i=0;i<=8;i++){var t=i/8,a=1-t*t*(3-2*t);st.push('rgba('+col.join(',')+','+a.toFixed(3)+') '+(t*100).toFixed(1)+'%')}return 'linear-gradient('+dir+','+st.join(',')+')'}
    function mid(a,b){return a.map(function(v,i){return Math.round((v+b[i])/2)})}
    [['#regalos',[110,52,70],[94,45,64]],['#footer',[94,45,64],[94,45,64]]].forEach(function(d){
      var el=document.querySelector(d[0]);if(!el)return;
      var prev=el.previousElementSibling,pc=prev?getComputedStyle(prev).backgroundColor:bg;
      var up=(/rgba\(0, 0, 0, 0\)|transparent/.test(pc))?rgb(bg):rgb(pc);
      var t=document.createElement('i');t.className='sfade top';t.style.background=ramp(mid(d[1],up),'to top');el.prepend(t);
    });
  }
  initSectionFades();

  /* hero vivo */
  var hb=document.querySelector('#hero .hero-bg'),hero=document.getElementById('hero'),hc=document.querySelector('#hero .hero-content');
  if(hb){hb.innerHTML='<i class="hero-drift"></i>';
    var fx='<div class="hero-glow g1"></div><div class="hero-glow g2"></div><div class="hero-glow g3"></div><div class="hero-lens"></div><div class="hero-vig"></div><div class="hero-dust">';
    for(var i=0;i<16;i++){var sz=2+Math.random()*2;fx+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;width:'+sz.toFixed(1)+'px;height:'+sz.toFixed(1)+'px;animation-duration:'+(9+Math.random()*9).toFixed(1)+'s;animation-delay:-'+(Math.random()*16).toFixed(1)+'s"></i>'}
    hb.insertAdjacentHTML('afterend',fx+'</div>');
  }
  var ticking=false;
  function heroScroll(){ticking=false;if(!hero)return;var h=hero.offsetHeight,p=Math.max(0,Math.min(1,scrollY/h));
    if(hc){hc.style.transform='translateY('+(-110*p).toFixed(1)+'px)';hc.style.opacity=(1-p).toFixed(3);hc.style.filter=p>0.01?'blur('+(10*p).toFixed(1)+'px)':''}
    if(hb)hb.style.transform='translateY('+(-70*p).toFixed(1)+'px)';}
  if(!reduced)addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(heroScroll)}},{passive:true});

  /* menú */
  var mbtn=document.getElementById('menu-btn'),panel=document.getElementById('menu-panel');
  function openM(){panel.classList.add('open');stopAuto()}
  function closeM(){panel.classList.remove('open')}
  mbtn.addEventListener('click',openM);panel.querySelector('.mx').addEventListener('click',closeM);
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();closeM();var t=document.querySelector(a.getAttribute('href'));if(t)setTimeout(function(){t.scrollIntoView({behavior:'smooth'})},250)})});

  /* recorrido automático */
  var auto=false,stopped=false,last=0,acc=0,speed=0,startT=0,raf=0,expect=null;
  function stopAuto(){stopped=true;auto=false;cancelAnimationFrame(raf)}
  ['wheel','touchstart','pointerdown'].forEach(function(ev){addEventListener(ev,function(){if(auto)stopAuto()},{passive:true,capture:true})});
  addEventListener('keydown',function(e){if(auto&&/Arrow|Page|Home|End| /.test(e.key))stopAuto()},{capture:true});
  addEventListener('scroll',function(){if(auto&&expect!==null&&Math.abs(scrollY-expect)>4)stopAuto()},{passive:true});
  document.addEventListener('click',function(e){if(auto&&e.target.closest('a,button,.wheel-ring,input'))stopAuto()},true);
  function slowZone(){var y=scrollY+innerHeight*.5;var z=['#hero','#galeria','#s-cd'];for(var i=0;i<z.length;i++){var e=document.querySelector(z[i]);if(!e)continue;var r=e.getBoundingClientRect();if(r.top<innerHeight*.5&&r.bottom>innerHeight*.5)return true}return false}
  function step(t){if(!auto)return;if(document.hidden){last=t;raf=requestAnimationFrame(step);return}
    var dt=last?Math.min(64,t-last):16;last=t;
    var target=slowZone()?24:37,ramp=Math.min(1,(t-startT)/1000);
    var remain=document.documentElement.scrollHeight-innerHeight-scrollY;
    var brake=Math.min(1,remain/40);
    speed=target*ramp*brake;acc+=speed*dt/1000;
    if(remain<=1){auto=false;return}
    if(acc>=1){var n=Math.floor(acc);acc-=n;expect=scrollY+n;window.scrollTo(0,expect)}
    raf=requestAnimationFrame(step)}
  function startAuto(){if(stopped||reduced||location.hash||/noauto/.test(location.search))return;
    document.documentElement.style.scrollBehavior='auto';auto=true;startT=performance.now();last=0;raf=requestAnimationFrame(step)}

  /* aparece menú + arranca recorrido tras abrir el libro */
  new MutationObserver(function(ms,o){if(!document.body.classList.contains('locked')){o.disconnect();
    setTimeout(function(){mbtn.classList.add('show')},1000);setTimeout(startAuto,2500)}}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
