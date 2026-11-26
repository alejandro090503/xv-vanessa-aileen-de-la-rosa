/* LIGERO: marca .live en la(s) sección(es) en pantalla; CSS apaga animaciones del resto */
(function(){
  var secs=document.querySelectorAll('.wrap>section');
  if(!('IntersectionObserver' in window)){secs.forEach(function(s){s.classList.add('live')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('live',e.isIntersecting)})},{rootMargin:'8% 0px 8% 0px'});
  secs.forEach(function(s){io.observe(s)});
})();
