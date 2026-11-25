/* INSERTAR: en un <script> nuevo justo antes de </body> (ancla única: </body>). Inyecta tintas y adornos en cada sección; no toca el HTML base. */
(function(){
  var TINTAS=[ // selector, imagen, espejo, dirección, delay
    ['.intro','top',0,'d1',0],['.sec-sm','corner',0,'d2',-6],['.locs','oval',1,'d3',-11],['.itin','corner',1,'d4',-4],
    ['.dress','hero',0,'d2',-15],['#regalos','footer',1,'d1',-9],['#rsvp-section','oval',0,'d4',-2],['#album','top',1,'d3',-17]];
  var ADS=[ // 1 por sección máx., todos desenfocados, esquinas alternadas
    ['.retrato','aurora',0,'left:-28%;top:2%;width:62%;--o:.22;--t:12s;--dl:-3s'],
    ['.locs','castillo',0,'left:-24%;bottom:-2%;width:58%;--o:.2;--t:13s;--dl:-7s'],
    ['.itin','flora',0,'right:-20%;top:4%;width:48%;--o:.22;--t:11s;--dl:-2s'],
    ['#rsvp-section','rosas',0,'right:-30%;bottom:-6%;width:66%;--o:.2;--t:14s;--dl:-9s'],
    ['#album','fauna',0,'left:-22%;top:2%;width:56%;--o:.22;--t:12.5s;--dl:-5s']];
  function go(){
    if(document.body.getAttribute('data-capasA'))return;
    document.body.setAttribute('data-capasA','1');
    TINTAS.forEach(function(t){
      var s=document.querySelector(t[0]);if(!s)return;
      s.classList.add('ink-sec');
      var d=document.createElement('div');
      d.className='ink-bg '+t[3]+(t[2]?' esp':'');
      d.setAttribute('aria-hidden','true');
      var im=new Image();im.alt='';im.decoding='async';im.src='ink/'+t[1]+'.webp';
      im.style.setProperty('--dl',t[4]+'s');
      im.onerror=function(){d.remove()};
      d.appendChild(im);s.insertBefore(d,s.firstChild);
    });
    ADS.forEach(function(a){
      var s=document.querySelector(a[0]);if(!s)return;
      s.classList.add('ink-sec');
      var im=new Image();im.alt='';im.decoding='async';im.loading='lazy';
      im.className='adorno '+(a[2]?'nit':'bor');
      im.src='assets/ad-'+a[1]+(a[2]?'':'-b')+'.webp';
      im.setAttribute('aria-hidden','true');
      im.style.cssText=a[3];
      im.onerror=function(){this.remove()};
      s.insertBefore(im,s.firstChild);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
