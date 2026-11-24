/* INSERTAR: en un <script> nuevo justo antes de </body> (ancla única: </body>, después de A-capas.js). Pétalos que caen. */
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var st=document.createElement('style');
  st.textContent='#petalosA{position:fixed;left:0;top:0;right:0;bottom:0;z-index:4;pointer-events:none;overflow:hidden}'+
   '#petalosA .pt{position:absolute;left:0;top:0;perspective:380px;will-change:transform}'+
   '#petalosA .pt img{display:block;width:100%;height:auto;transform-style:preserve-3d;animation:ptAleteo var(--af,3s) ease-in-out infinite alternate;animation-delay:var(--ad,0s)}'+
   '@keyframes ptAleteo{from{transform:rotateX(-20deg) rotateY(-65deg) rotateZ(var(--z0,-20deg))}to{transform:rotateX(75deg) rotateY(65deg) rotateZ(var(--z1,25deg))}}';
  document.head.appendChild(st);
  var box=document.createElement('div');box.id='petalosA';box.setAttribute('aria-hidden','true');
  document.body.appendChild(box);
  var N=innerWidth<700?14:22,ps=[],wrap=document.querySelector('.wrap');
  function R(a,b){return a+Math.random()*(b-a)}
  function area(){var r=wrap?wrap.getBoundingClientRect():{left:0,width:innerWidth};return{l:Math.max(0,r.left),w:Math.min(r.width,innerWidth)}}
  function reset(p,first){
    var a=area();p.x0=a.l+R(0,a.w);
    p.y=first?R(-innerHeight,innerHeight):-R(40,innerHeight*.5);
    p.v=R(26,52)*(p.big?.8:1);p.amp=R(14,40);p.f=R(.5,1.2);p.ph=R(0,6.28);p.rot=R(-30,30);
  }
  for(var i=0;i<N;i++){
    var big=i%4===0,k=1+(i%3),w=big?R(34,46):R(18,28);
    var d=document.createElement('div');d.className='pt';
    d.style.width=w+'px';d.style.opacity=big?R(.2,.34):R(.28,.5);
    var im=new Image();im.alt='';im.decoding='async';
    im.src='assets/particula-'+k+(big?'-b':'')+'.webp';
    im.style.setProperty('--af',R(2.2,4.2)+'s');im.style.setProperty('--ad',-R(0,4)+'s');
    im.style.setProperty('--z0',R(-40,0)+'deg');im.style.setProperty('--z1',R(5,50)+'deg');
    im.onerror=function(){this.parentNode.style.display='none'};
    d.appendChild(im);box.appendChild(d);
    var p={el:d,big:big};reset(p,true);ps.push(p);
  }
  var last=0,t=0;
  function tick(now){
    requestAnimationFrame(tick);
    if(document.hidden||document.body.classList.contains('locked')){last=0;return}
    if(!last){last=now;return}
    var dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
    for(var i=0;i<ps.length;i++){
      var p=ps[i];p.y+=p.v*dt;
      if(p.y>innerHeight+60)reset(p,false);
      var s=Math.sin(t*p.f+p.ph),x=p.x0+s*p.amp;
      p.el.style.transform='translate3d('+x.toFixed(1)+'px,'+p.y.toFixed(1)+'px,0) rotate('+(p.rot+s*18).toFixed(1)+'deg)';
    }
  }
  requestAnimationFrame(tick);
})();
