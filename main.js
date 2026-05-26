// ── Cursor ────────────────────────────────────────────────────────────────────
const cur = document.getElementById('cur');
if (cur && window.matchMedia('(hover:hover)').matches) {
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  (function tick(){
    cx+=(mx-cx)*.14; cy+=(my-cy)*.14;
    cur.style.left=cx+'px'; cur.style.top=cy+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('button,.slide,.dot,.s-btn,a,.check-box,video').forEach(el=>{
    el.addEventListener('mouseenter',()=>cur.classList.add('big'));
    el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
  });
}

// ── Nav hamburger ─────────────────────────────────────────────────────────────
const ham = document.getElementById('ham');
const nav = document.getElementById('navLinks');
ham.addEventListener('click',()=>{
  nav.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>nav.classList.remove('open'));
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const ro = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.1});
document.querySelectorAll('.rv,.video-wrap').forEach(el=>ro.observe(el));

// ── Slider ────────────────────────────────────────────────────────────────────
const track   = document.getElementById('track');
const dotsEl  = document.getElementById('dotsEl');
const slides  = document.querySelectorAll('.slide');
const dots    = document.querySelectorAll('.dot');
let cur2=0, dragging=false, sx=0, dx=0, auto;

const sw = () => {
  const s = slides[0];
  return s.offsetWidth + 20; // gap 1.25rem ≈ 20px
};

const go = i => {
  cur2 = Math.max(0, Math.min(i, slides.length-1));
  track.style.transform = `translateX(${-cur2*sw()}px)`;
  slides.forEach((s,j)=>s.classList.toggle('active',j===cur2));
  dots.forEach((d,j)=>d.classList.toggle('on',j===cur2));
};

document.getElementById('prev').onclick = ()=>{ go(cur2-1); resetAuto(); };
document.getElementById('next').onclick = ()=>{ go(cur2+1); resetAuto(); };
dots.forEach(d=>d.addEventListener('click',()=>{ go(+d.dataset.i); resetAuto(); }));

// drag
track.addEventListener('mousedown',e=>{ dragging=true; sx=e.clientX; track.style.transition='none'; });
document.addEventListener('mousemove',e=>{
  if(!dragging) return;
  dx=e.clientX-sx;
  track.style.transform=`translateX(${-cur2*sw()+dx}px)`;
});
document.addEventListener('mouseup',()=>{
  if(!dragging) return; dragging=false;
  track.style.transition='transform .75s cubic-bezier(0.16,1,0.3,1)';
  if(dx<-60) go(cur2+1); else if(dx>60) go(cur2-1); else go(cur2);
  dx=0; resetAuto();
});
track.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; track.style.transition='none'; },{passive:true});
track.addEventListener('touchmove',e=>{
  dx=e.touches[0].clientX-sx;
  track.style.transform=`translateX(${-cur2*sw()+dx}px)`;
},{passive:true});
track.addEventListener('touchend',()=>{
  track.style.transition='transform .75s cubic-bezier(0.16,1,0.3,1)';
  if(dx<-60) go(cur2+1); else if(dx>60) go(cur2-1); else go(cur2);
  dx=0; resetAuto();
});

const resetAuto = () => { clearInterval(auto); auto=setInterval(()=>go((cur2+1)%slides.length),4800); };
resetAuto();
window.addEventListener('resize',()=>go(cur2));

// ── Checklist ─────────────────────────────────────────────────────────────────
document.querySelectorAll('[data-check]').forEach(item=>{
  const box = item.querySelector('.check-box');
  box.addEventListener('click',()=>{
    box.classList.toggle('checked');
    item.classList.toggle('done');
  });
});

// ── Parallax hero ─────────────────────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll',()=>{
  if(heroBg) heroBg.style.transform=`translateY(${window.scrollY*.25}px)`;
},{passive:true});
