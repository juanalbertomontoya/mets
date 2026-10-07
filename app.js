'use strict';
const menu=document.querySelector('.menu-toggle'),links=document.querySelector('.nav-links');
function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';links.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.nav'))closeMenu()});
const services={support:{title:'Atención al cliente',intro:'Un equipo que conoce tus procesos y acompaña a cada persona hasta encontrar una respuesta.',items:['Atención de consultas y requerimientos por los canales definidos para tu operación.','Orientación y soporte técnico u operativo de primer nivel.','Seguimiento de incidencias y derivación cuando se necesita apoyo especializado.','Retroalimentación sobre necesidades y problemas detectados en la atención.'],select:'Mesa de ayuda y atención al cliente'},sales:{title:'Gestión comercial',intro:'Damos continuidad a las oportunidades comerciales con personas que orientan y acompañan al cliente.',items:['Prospección y contacto con potenciales clientes.','Seguimiento de interesados y resolución de consultas.','Acompañamiento en procesos de adhesión y revisión de documentación.','Gestión del contacto hasta el cierre del proceso comercial.'],select:'Gestión comercial'},research:{title:'Encuestas y estudios de mercado',intro:'Recogemos la voz de tus clientes para apoyar tus decisiones y tus estudios de mercado.',items:['Encuestas telefónicas asistidas por computador (CATI).','Medición de satisfacción y seguimiento de experiencias.','Estudios telefónicos de mercado según los segmentos definidos.','Campañas para empresas y agencias de investigación.'],select:'Encuestas e investigación'},outbound:{title:'Contacto saliente',intro:'Mantenemos una comunicación proactiva con tus clientes en los momentos que tu operación necesita.',items:['Seguimiento de solicitudes y procesos.','Confirmación de eventos y comunicación de información.','Campañas de cobranza y recordatorios.','Coordinación del alcance y los canales para cada campaña.'],select:'Contacto y seguimiento'},monitoring:{title:'Monitoreo digital',intro:'Escuchamos lo que ocurre en el entorno digital para comprender mejor a tu audiencia.',items:['Monitoreo de conversaciones en redes sociales.','Información sobre la percepción de tu marca o servicio.','Identificación de señales y necesidades relevantes para tu equipo.','Reportería para apoyar la mejora del servicio.'],select:'Monitoreo digital'}};
services.audit={title:'Auditorías de calidad',intro:'Revisamos interacciones y materiales para comprobar el cumplimiento de los criterios definidos por tu empresa.',items:['Evaluación de grabaciones de llamadas.','Revisión de documentos y vídeos.','Aplicación de pautas de evaluación definidas por el cliente.','Identificación de oportunidades para mejorar la calidad.']};
const dialog=document.querySelector('#service-dialog');let currentService;
document.addEventListener('click',e=>{const button=e.target.closest('[data-service]');if(!button)return;currentService=services[button.dataset.service];document.querySelector('#dialog-title').textContent=currentService.title;document.querySelector('#dialog-intro').textContent=currentService.intro;const list=document.querySelector('#dialog-list');list.replaceChildren(...currentService.items.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));dialog.showModal()});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelector('#dialog-cta').addEventListener('click',e=>{e.preventDefault();dialog.close();openContact(currentService.title)});
document.querySelectorAll('.tech-features details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.tech-features details').forEach(other=>{if(other!==d)other.open=false})}));

const contactDialog=document.querySelector('#contact-dialog');
function openContact(service){if(service)contactDialog.querySelector('textarea').value='Me gustaría recibir información sobre '+service+'.';contactDialog.showModal()}
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>openContact()));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelectorAll('.contact-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const body=`Hola, equipo METS:\n\nNombre: ${data.get('name')}\nTeléfono: ${data.get('phone')||'No indicado'}\nCorreo corporativo: ${data.get('email')}\n\n${data.get('message')}\n`;window.location.href=`mailto:contacto@mets.cl?subject=${encodeURIComponent('Consulta web METS')}&body=${encodeURIComponent(body)}`;form.querySelector('.form-status').textContent='Consulta preparada. Revisa y envía el mensaje desde tu aplicación de correo. Si no se abrió, escribe a contacto@mets.cl.'}));
const infraItems=[...document.querySelectorAll('[data-infra]')];
let infraIndex=0;
function activateInfra(index){infraIndex=(index+infraItems.length)%infraItems.length;infraItems.forEach((item,i)=>{item.classList.toggle('active',i===infraIndex);item.setAttribute('aria-pressed',String(i===infraIndex))})}
let infraTimer;
function startInfra(){clearInterval(infraTimer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)infraTimer=setInterval(()=>{if(!document.hidden)activateInfra(infraIndex+1)},3000)}
infraItems.forEach((b,i)=>b.addEventListener('click',()=>{activateInfra(i);startInfra()}));
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',startInfra);startInfra();
document.querySelectorAll('[data-careers]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();closeMenu();document.querySelector('#careers-dialog').showModal()}));
document.querySelectorAll('[data-legal]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#legal-title').textContent=b.dataset.legal==='privacy'?'Política de privacidad':'Términos y condiciones';document.querySelector('#legal-dialog').showModal()}));
document.querySelector('#year').textContent=new Date().getFullYear();

// Infinite, draggable carousel. Copies provide a seamless visual boundary;
// only the original group is exposed to assistive technology.
function createInfiniteCarousel(shell, {autoplay = false} = {}) {
  const viewport = shell.querySelector('.carousel-window');
  const track = shell.querySelector('.carousel-track');
  const originals = [...track.children];
  const count = originals.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copyGroup = () => originals.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('button,a,input,[tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
    return copy;
  });
  track.prepend(...copyGroup());
  track.append(...copyGroup());
  let index = count, step = 0, busy = false, dragging = false, startX = 0, delta = 0;
  let pointer = null, settleTimer, autoTimer, suppressClick = false;
  const render = (animate = false, offset = 0) => {
    track.style.transition = animate && !reducedMotion.matches ? 'transform 500ms cubic-bezier(.22,.61,.36,1)' : 'none';
    track.style.transform = `translate3d(${-index * step + offset}px,0,0)`;
  };
  const normalize = () => {
    clearTimeout(settleTimer);
    index = count + ((index - count) % count + count) % count;
    busy = false;
    render();
  };
  const measure = () => {
    step = originals[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    normalize();
  };
  const advance = (direction) => {
    if (busy || dragging) return;
    busy = true;
    index += direction;
    render(true);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(normalize, reducedMotion.matches ? 0 : 550);
  };
  const resetAuto = () => {
    clearInterval(autoTimer);
    if (autoplay && !reducedMotion.matches) autoTimer = setInterval(() => {
      if (!document.hidden && pointer === null && !track.contains(document.activeElement)) advance(1);
    }, 3000);
  };
  shell.querySelector('.previous').addEventListener('click', () => { advance(-1); resetAuto(); });
  shell.querySelector('.next').addEventListener('click', () => { advance(1); resetAuto(); });
  track.addEventListener('transitionend', e => { if (e.target === track && e.propertyName === 'transform') normalize(); });
  viewport.addEventListener('keydown', e => {
    if (e.target === viewport && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault(); advance(e.key === 'ArrowRight' ? 1 : -1); resetAuto();
    }
  });
  viewport.addEventListener('pointerdown', e => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || busy) return;
    pointer = e.pointerId; startX = e.clientX; delta = 0; dragging = false;
  });
  viewport.addEventListener('pointermove', e => {
    if (e.pointerId !== pointer) return;
    delta = e.clientX - startX;
    if (Math.abs(delta) > 7 && !dragging) {
      dragging = true; suppressClick = true;
      viewport.classList.add('dragging'); viewport.setPointerCapture(pointer);
    }
    if (dragging) render(false, Math.max(-step, Math.min(step, delta)));
  });
  const release = e => {
    if (e.pointerId !== pointer) return;
    const wasDragging = dragging;
    pointer = null; dragging = false; viewport.classList.remove('dragging');
    if (wasDragging) {
      if (Math.abs(delta) > Math.min(60, step * .18)) advance(delta < 0 ? 1 : -1);
      else { render(true); settleTimer = setTimeout(normalize, 550); }
      setTimeout(() => { suppressClick = false; }, 0);
      resetAuto();
    }
  };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', e => { if (e.pointerId === pointer) { delta = 0; release(e); } });
  viewport.addEventListener('pointerleave', e => { if (!dragging && e.pointerId === pointer) pointer = null; });
  viewport.addEventListener('click', e => { if (suppressClick) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  window.addEventListener('resize', measure);
  reducedMotion.addEventListener('change', () => { normalize(); resetAuto(); });
  measure(); resetAuto();
}
createInfiniteCarousel(document.querySelector('.service-carousel'), {autoplay:true});
createInfiniteCarousel(document.querySelector('.testimonial-carousel'));

// Background video is revealed only after Vimeo confirms actual playback.
// The poster remains underneath throughout loading, autoplay denial or errors.
function mountBackgroundVideo(container) {
  if (!window.Vimeo?.Player || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const frame = document.createElement('iframe');
  frame.src = `https://player.vimeo.com/video/${container.dataset.videoId}?background=1&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&controls=0&title=0&byline=0&portrait=0&dnt=1`;
  frame.title = container.dataset.videoId === '1233891269' ? 'Vídeo de fondo METS' : 'Vídeo de fondo: quiénes somos';
  frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  frame.tabIndex = -1;
  frame.setAttribute('aria-hidden', 'true');
  container.append(frame);
  let ratio = 16 / 9;
  const resize = () => {
    const width = Math.ceil(Math.max(container.clientWidth, container.clientHeight * ratio));
    frame.style.width = `${width}px`;
    frame.style.height = `${Math.ceil(width / ratio)}px`;
  };
  resize();
  new ResizeObserver(resize).observe(container);
  const player = new Vimeo.Player(frame);
  const fallback = () => container.classList.remove('video-playing');
  player.on('playing', () => container.classList.add('video-playing'));
  player.on('timeupdate', data => { if (data.seconds > 0) container.classList.add('video-playing'); });
  player.on('error', fallback);
  player.on('pause', fallback);
  player.ready().then(() => {
    Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then(([w,h]) => {
      if (w > 0 && h > 0) { ratio = w / h; resize(); }
    }).catch(() => {});
    player.play().catch(fallback);
  }).catch(fallback);
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) { fallback(); player.pause().catch(() => {}); }
    else player.play().catch(fallback);
  });
}
document.querySelectorAll('.video-background').forEach(container => {
  if (container.closest('#inicio')) mountBackgroundVideo(container);
  else {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { mountBackgroundVideo(container); observer.disconnect(); }
    }, {rootMargin:'300px'});
    observer.observe(container);
  }
});
