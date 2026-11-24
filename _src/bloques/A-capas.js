/* INSERTAR: en un <script> nuevo justo antes de </body> (ancla única: </body>). Inyecta tintas y adornos en cada sección; no toca el HTML base. */
(function(){
  var TINTAS=[ // selector, imagen, espejo, dirección, delay
    ['.intro','top',0,'d1',0],['.sec-sm','corner',0,'d2',-6],['.locs','oval',1,'d3',-11],['.itin','corner',1,'d4',-4],
    ['.dress','hero',0,'d2',-15],['#regalos','footer',1,'d1',-9],['#rsvp-section','oval',0,'d4',-2],['#album','top',1,'d3',-17]];
  var ADS=[ // selector, archivo, nítido(1)/desenfocado(0), estilo
    ['.intro','castillo',0,'right:-24%;top:30%;width:64%;opacity:.26'],
    ['.retrato','flora',1,'left:-8%;top:3%;width:30%;--t:6.5s;--dl:-1s'],
    ['.retrato','aurora',0,'right:-26%;bottom:-4%;width:66%;opacity:.24'],
    ['.sec-sm','rosas',0,'left:-30%;top:-10%;width:70%;opacity:.25'],
    ['.sec-sm','fauna',1,'right:-6%;bottom:2%;width:26%;--t:7.5s;--dl:-3s'],
    ['.locs','primavera',1,'right:-7%;top:1.5%;width:27%;--t:6s;--dl:-2s'],
    ['.locs','rosas',0,'left:-34%;bottom:-6%;width:78%;opacity:.22'],
    ['.itin','castillo',1,'left:-9%;bottom:1%;width:28%;--t:8s;--dl:-4s'],
    ['.itin','flora',0,'right:-18%;top:6%;width:50%;opacity:.24'],
    ['.dress','corona',1,'right:-7%;top:1%;width:30%;--t:7s;--dl:-5s'],
    ['.dress','fauna',0,'left:-20%;bottom:-2%;width:56%;opacity:.26'],
    ['#rsvp-section','rosas',1,'right:-30%;bottom:-6%;width:64%;--t:8s;--dl:-6s'],
    ['#rsvp-section','corona',0,'left:-22%;top:2%;width:56%;opacity:.22'],
    ['#album','flora',1,'right:-7%;top:1%;width:26%;--t:7.2s;--dl:-1.5s'],
    ['#album','fauna',0,'left:-24%;bottom:2%;width:62%;opacity:.26']];
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
