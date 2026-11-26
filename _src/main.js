(function(){
  var audio=document.getElementById('bg-music'),mb=document.getElementById('music-btn');
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function setPlay(p){mb.classList.toggle('playing',p)}
  mb.addEventListener('click',function(){ if(audio.paused){audio.play().then(function(){setPlay(true)}).catch(function(){})} else {audio.pause();setPlay(false)} });
  audio.addEventListener('pause',function(){setPlay(false)});audio.addEventListener('play',function(){setPlay(true)});

  /* ---- chispas (oro, rosa, champán) ---- */
  var cv=document.getElementById('sparks'),cx=cv.getContext('2d'),P=[],dpr=Math.min(devicePixelRatio||1,2);
  function rs(){cv.width=innerWidth*dpr;cv.height=innerHeight*dpr}rs();addEventListener('resize',rs);
  var MIX=['#ffd86b','#ffa1dd','#f7e7ce','#ffffff'];
  function burst(x,y,n){for(var i=0;i<n;i++){var a=Math.random()*6.283,v=1+Math.random()*4;P.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:1,s:1.5+Math.random()*3,c:MIX[i%4],st:Math.random()<.4})}}
  var ambient=0;
  function star(x,y,r){cx.beginPath();for(var i=0;i<8;i++){var rr=i%2?r*.38:r,a=i*Math.PI/4;cx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}cx.closePath();cx.fill()}
  function loop(){cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,innerWidth,innerHeight);
    if(ambient&&!reduced&&Math.random()<.16){P.push({x:Math.random()*innerWidth,y:innerHeight+5,vx:(Math.random()-.5)*.4,vy:-(.4+Math.random()*.8),l:1,s:1+Math.random()*2.2,c:MIX[(Math.random()*4)|0],st:Math.random()<.45,amb:1})}
    for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(!p.amb){p.vy+=.05;p.vx*=.98}p.l-=p.amb?.003:.012;
      if(p.l<=0){P.splice(i,1);continue}cx.globalAlpha=Math.max(p.l,0);cx.fillStyle=p.c;cx.shadowColor=p.c;cx.shadowBlur=8;
      if(p.st)star(p.x,p.y,p.s*1.8);else{cx.beginPath();cx.arc(p.x,p.y,p.s,0,6.283);cx.fill()}}
    cx.globalAlpha=1;requestAnimationFrame(loop)}
  loop();
  /* estrellitas desde la corona mientras suena la música */
  setInterval(function(){if(!mb.classList.contains('playing')||!mb.classList.contains('show'))return;var r=mb.getBoundingClientRect();
    for(var i=0;i<2;i++){var a=-Math.PI/2+(Math.random()-.5)*2.2,v=.6+Math.random()*1.4;
      P.push({x:r.left+r.width*(.25+Math.random()*.5),y:r.top+r.height*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.4,l:1,s:1.2+Math.random()*2.2,c:['#fff6c9','#ffd86b','#ffa1dd','#ffffff'][(Math.random()*4)|0],st:Math.random()<.75,amb:1})}},90);
  /* magia alrededor de la rueca */
  var rq=document.getElementById('rueca');
  setInterval(function(){if(!ambient||!rq)return;var r=rq.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
    for(var i=0;i<2;i++){var a=Math.random()*6.283,rad=r.width*(.42+Math.random()*.2);
      P.push({x:r.left+r.width/2+Math.cos(a)*rad*.8,y:r.top+r.height*.5+Math.sin(a)*rad,vx:(Math.random()-.5)*.5,vy:-(.5+Math.random()*1),l:1,s:1+Math.random()*2.4,c:['#ffffff','#ffa1dd','#ffd1e8','#f7e7ce'][(Math.random()*4)|0],st:Math.random()<.5,amb:1})}},140);

  /* ---- abrir sobre (video) ---- */
  var libro=document.getElementById('libro'),vid=document.getElementById('envVideo'),opened=false;
  function abrir(e){ if(opened)return;opened=true;if(e&&e.cancelable)e.preventDefault();
    audio.play().then(function(){setPlay(true)}).catch(function(){});
    var tp=libro.querySelector('.tap');tp.style.animation='none';tp.style.transition='opacity .4s';tp.style.opacity=0;
    var done=false;function fin(){if(done)return;done=true;
      libro.classList.add('gone');document.body.classList.remove('locked');
      setTimeout(function(){mb.classList.add('show');ambient=1},900);
      setTimeout(function(){libro.remove()},2600);}
    var pr=vid.play();libro.classList.add('play');if(pr&&pr.catch)pr.catch(function(){fin()});
    vid.addEventListener('ended',fin,{once:true});setTimeout(fin,9000);
  }
  libro.addEventListener('click',abrir,{passive:false});libro.addEventListener('touchstart',abrir,{passive:false});


  /* ---- scroll hint ---- */
  var hint=document.getElementById('scrollHint'),hh=false;
  window.addEventListener('scroll',function(){if(!hh&&window.scrollY>60){hh=true;hint.classList.add('hidden')}},{passive:true});

  /* ---- arco de fotos ---- */
  var fts=document.querySelectorAll('.ft'),fi=0;
  setInterval(function(){fts[fi].classList.remove('on');fi=(fi+1)%fts.length;fts[fi].classList.add('on')},5000);

  /* ---- cuenta regresiva en anillos (16 ene 2027, 3:50 pm) ---- */
  var target=new Date('2027-01-16T15:50:00-06:00').getTime(),RING=2*Math.PI*52,prevS='';
  function pad(n){return String(n).padStart(2,'0')}
  function ring(id,p){var el=document.getElementById(id);if(!el)return;el.style.strokeDashoffset=(RING*(1-Math.max(0,Math.min(1,p)))).toFixed(2)}
  function tick(){
    var d=Math.max(0,target-Date.now());
    var days=Math.floor(d/86400000),hrs=Math.floor(d%86400000/3600000),mins=Math.floor(d%3600000/60000),secs=Math.floor(d%60000/1000);
    document.getElementById('cdD').textContent=String(days).padStart(3,'0');
    document.getElementById('cdH').textContent=pad(hrs);
    document.getElementById('cdM').textContent=pad(mins);
    ring('ringD',Math.min(days/365,1));ring('ringH',hrs/24);ring('ringM',mins/60);ring('ringS',secs/60);
    var ns=pad(secs);
    if(ns!==prevS){document.getElementById('cdS').textContent=ns;prevS=ns;
      if(!reduced){var it=document.getElementById('cdItemS');it.classList.remove('tick');void it.offsetWidth;it.classList.add('tick')}}
  }
  tick();setInterval(tick,1000);

  /* ---- rueda 3D de fotos ---- */
  (function(){
    var ring=document.getElementById('wheel-ring');if(!ring)return;
    var cards=ring.querySelectorAll('.wheel-card'),n=cards.length;if(!n)return;
    var R=Math.round((150+14)/(2*Math.sin(Math.PI/n)));
    var rot=0,vel=0,drag=false,sx=0,sr=0,lx=0,raf=null,auto=true;
    cards.forEach(function(c,i){c.style.transform='rotateY('+(360/n*i)+'deg) translateZ('+R+'px)'});
    function set(){ring.style.transform='translateZ(-'+R+'px) rotateY('+rot+'deg)'}set();
    function inertia(){if(drag)return;rot+=vel;vel*=.94;set();if(Math.abs(vel)>.05)raf=requestAnimationFrame(inertia)}
    function down(x){drag=true;auto=false;ring.classList.add('dragging');sx=x;lx=x;sr=rot;vel=0;if(raf)cancelAnimationFrame(raf)}
    function move(x){if(!drag)return;rot=sr+(x-sx)*.45;vel=(x-lx)*.5;lx=x;set()}
    function up(){if(!drag)return;drag=false;ring.classList.remove('dragging');raf=requestAnimationFrame(inertia)}
    ring.addEventListener('mousedown',function(e){e.preventDefault();down(e.clientX)});
    window.addEventListener('mousemove',function(e){move(e.clientX)});window.addEventListener('mouseup',up);
    ring.addEventListener('touchstart',function(e){down(e.touches[0].clientX)},{passive:true});
    ring.addEventListener('touchmove',function(e){move(e.touches[0].clientX)},{passive:true});
    ring.addEventListener('touchend',up);
    (function spin(){if(auto&&!drag&&!reduced){rot+=.14;set()}requestAnimationFrame(spin)})();
  })();

  /* ---- revelados ---- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})},9000);

  /* ---- RSVP · PANEL ---- */
  /*RSVP_JS*/
})();
