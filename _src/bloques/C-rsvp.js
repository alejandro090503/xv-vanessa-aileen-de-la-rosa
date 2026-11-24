/* INSERTAR: antes del marcador AUDIO_JS de template.html (2º script). Si se quiere limpio: quitar también el marcador RSVP_JS de main.js y los stubs ocultos de C-rsvp.html. */
(function(){
  var API='https://panel-invitados.vercel.app/api/confirmar';
  var URL_BODA='https://xv-vanessa-aileen-de-la-rosa.vercel.app';
  var DEADLINE=new Date(2026,11,31,23,59,59,999);
  var frozen=Date.now()>DEADLINE.getTime();
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qs=new URLSearchParams(location.search);
  var para=(qs.get('para')||'').trim();
  var pases=parseInt(qs.get('pases'),10);if(isNaN(pases)||pases<1||pases>20)pases=1;
  var menores=parseInt(qs.get('menores'),10);if(isNaN(menores)||menores<0||menores>20)menores=0;
  function $(id){return document.getElementById(id)}
  var hi=$('rsv-hi'),note=$('rsv-note'),numEl=$('rsv-pases'),menBox=$('rsv-menores-box'),menEl=$('rsv-menores');
  var toggle=$('rsv-toggle'),yes=$('rsv-yes'),no=$('rsv-no'),asigEl=$('rsv-asig'),fields=$('rsv-fields');
  var send=$('rsv-send'),sendT=$('rsv-send-t'),fb=$('rsv-fb');
  var bandeja=$('rsv-bandeja'),gracias=$('rsv-gracias'),gT=$('rsv-gracias-t'),gS=$('rsv-gracias-s'),edit=$('rsv-edit');
  if(!yes||!send)return;
  var estado=null,savedNames=[],asignados=[],choices={};
  function setFb(t,c){fb.textContent=t;fb.className='rsv-fb'+(c?' '+c:'')}
  function paint(){
    numEl.textContent=pases;
    note.textContent=pases===1?'Hemos reservado un lugar para ti.':'Hemos reservado '+pases+' lugares en tu honor.';
    if(menores>0){menBox.style.display='';menEl.textContent=menores}
    if(para){hi.textContent=para;hi.style.display=''}
  }
  paint();
  function buildFields(){
    fields.innerHTML='';
    for(var i=0;i<pases;i++){
      var inp=document.createElement('input');inp.type='text';inp.className='rsv-input';
      inp.placeholder=pases===1?'Tu nombre completo':'Nombre completo del invitado '+(i+1);
      inp.autocomplete='name';inp.maxLength=60;
      if(savedNames[i])inp.value=savedNames[i];
      fields.appendChild(inp);
    }
  }
  function selectRsvp(v){
    estado=v;yes.classList.toggle('on',v==='confirmado');no.classList.toggle('on',v==='declino');
    if(v==='confirmado'){buildFields();fields.style.display=''}else{fields.innerHTML='';fields.style.display='none'}
  }
  yes.addEventListener('click',function(){if(!frozen)selectRsvp('confirmado')});
  no.addEventListener('click',function(){if(!frozen)selectRsvp('declino')});
  function renderAsig(){
    asigEl.innerHTML='';
    asignados.forEach(function(nm,i){
      var card=document.createElement('div');card.className='rsv-person';
      var n=document.createElement('div');n.className='rsv-person-n';n.textContent=nm;
      var t=document.createElement('div');t.className='rsv-person-t';
      [['yes','Asistiré'],['no','No asistiré']].forEach(function(p){
        var b=document.createElement('button');b.type='button';b.className='rsv-mini'+(choices[i]===p[0]?' on':'');b.textContent=p[1];b.disabled=frozen;
        b.addEventListener('click',function(){if(frozen)return;choices[i]=p[0];renderAsig()});
        t.appendChild(b);
      });
      card.appendChild(n);card.appendChild(t);asigEl.appendChild(card);
    });
  }
  function activarAsignados(list){
    asignados=list.slice();toggle.style.display='none';fields.style.display='none';fields.innerHTML='';asigEl.style.display='flex';renderAsig();
  }
  function mostrarGracias(est,nombres){
    if(est==='confirmado'){
      gT.textContent='¡Gracias por confirmar!';
      gS.textContent=nombres.length===1?'Te esperamos, '+nombres[0]+'.':'Confirmamos '+nombres.length+' lugares: '+nombres.join(', ')+'.';
    }else{
      gT.textContent='Gracias por avisarnos';
      gS.textContent='Lamentamos que no puedas acompañarnos. Te vamos a extrañar.';
    }
    bandeja.style.display='none';gracias.style.display='';
  }
  edit.addEventListener('click',function(){if(frozen)return;gracias.style.display='none';bandeja.style.display='';setFb('')});
  function confetti(){
    if(RM)return;
    var cols=['#B76E79','#C0C0C0','#F7E7CE','#ffddcf','#8a4552','#ffffff'];
    for(var i=0;i<70;i++){
      var c=document.createElement('i');c.className='rsv-confetti';
      c.style.left=Math.random()*100+'vw';c.style.background=cols[i%cols.length];
      document.body.appendChild(c);
      var a=c.animate([{transform:'translateY(0) rotate(0)',opacity:1},{transform:'translateY('+(innerHeight+40)+'px) translateX('+(Math.random()*120-60)+'px) rotate('+(Math.random()*720)+'deg)',opacity:.85}],
        {duration:2200+Math.random()*1600,delay:Math.random()*400,easing:'cubic-bezier(.2,.6,.4,1)'});
      a.onfinish=(function(el){return function(){el.remove()}})(c);
    }
  }
  if(frozen){
    yes.disabled=no.disabled=send.disabled=edit.disabled=true;
    sendT.textContent='Confirmaciones cerradas';
    setFb('La fecha límite para confirmar ya pasó.','err');
  }
  if(para){
    fetch(API+'?nombre='+encodeURIComponent(para)+'&url_boda='+encodeURIComponent(URL_BODA))
      .then(function(r){return r.json()})
      .then(function(resp){
        var d=resp&&resp.invitado;if(!d)return;
        if(typeof d.pases==='number'&&d.pases>0&&d.pases<=20){pases=d.pases;paint()}
        var respondido=d.estado==='confirmado'||d.estado==='declino';
        if(Array.isArray(d.nombres_asignados)&&d.nombres_asignados.length){
          var lower=(d.nombres_confirmados||[]).map(function(s){return String(s).toLowerCase().trim()});
          activarAsignados(d.nombres_asignados);
          if(respondido){
            asignados.forEach(function(nm,i){choices[i]=d.estado==='declino'?'no':(lower.indexOf(nm.toLowerCase().trim())>=0?'yes':'no')});
            renderAsig();sendT.textContent='Actualizar respuesta';
            mostrarGracias(d.estado,d.estado==='confirmado'?(d.nombres_confirmados||[]):[]);
          }
          return;
        }
        if(respondido){
          savedNames=d.nombres_confirmados||[];
          selectRsvp(d.estado);sendT.textContent='Actualizar respuesta';
          mostrarGracias(d.estado,savedNames);
        }
      }).catch(function(){});
  }
  send.addEventListener('click',function(){
    if(frozen)return;
    var nombres=[],est;
    if(asignados.length){
      var faltan=asignados.filter(function(_,i){return !choices[i]}).length;
      if(faltan){setFb('Responde por cada invitado ('+faltan+' pendiente'+(faltan===1?'':'s')+').','err');return}
      nombres=asignados.filter(function(_,i){return choices[i]==='yes'});
      est=nombres.length?'confirmado':'declino';
    }else{
      if(!estado){setFb('Elige si asistirás o no.','err');return}
      est=estado;
      if(est==='confirmado'){
        [].forEach.call(fields.querySelectorAll('input'),function(i){var v=i.value.trim();if(v)nombres.push(v)});
        if(!nombres.length){setFb('Escribe al menos un nombre.','err');return}
      }
    }
    send.disabled=true;setFb('Enviando…');
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({nombre:para||(nombres[0]||'Invitado'),url_boda:URL_BODA,estado:est,pases_confirmados:est==='confirmado'?nombres.length:0,nombres_confirmados:est==='confirmado'?nombres:[]})})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(d){return{ok:r.ok,d:d}})})
      .then(function(res){
        send.disabled=false;
        if(!res.ok||(res.d&&res.d.ok===false)){setFb('No pudimos registrar tu respuesta. Intenta de nuevo.','err');return}
        savedNames=nombres;sendT.textContent='Actualizar respuesta';setFb('');
        mostrarGracias(est,nombres);
        if(est==='confirmado')confetti();
      })
      .catch(function(){send.disabled=false;setFb('Sin conexión. Intenta de nuevo.','err')});
  });
})();
