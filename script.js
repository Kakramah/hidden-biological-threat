(()=>{'use strict';
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const $=id=>document.getElementById(id);
const progress=$('readingProgress');
let frame=0;
const updateProgress=()=>{frame=0;if(reduce.matches)return;const extent=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);const v=Math.min(1,Math.max(0,window.scrollY/extent));progress.style.transform=`scaleX(${v})`};
window.addEventListener('scroll',()=>{if(!reduce.matches&&!frame)frame=requestAnimationFrame(updateProgress)},{passive:true});window.addEventListener('resize',updateProgress,{passive:true});
reduce.addEventListener('change',()=>{if(reduce.matches){if(frame)cancelAnimationFrame(frame);frame=0;progress.style.transform='scaleX(0)'}else updateProgress()});updateProgress();
const timeline=document.querySelector('.timeline'),timelineProgress=$('timelineProgress');function updateTimeline(){if(!timeline||!timelineProgress||reduce.matches)return;const r=timeline.getBoundingClientRect(),zone=Math.max(1,r.height-window.innerHeight*.28),v=Math.min(1,Math.max(0,(window.innerHeight*.5-r.top)/zone));timelineProgress.style.transform=`scaleY(${v})`}window.addEventListener('scroll',updateTimeline,{passive:true});window.addEventListener('resize',updateTimeline,{passive:true});updateTimeline();
if(!reduce.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('js-motion');const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{threshold:.04,rootMargin:'0px 0px -20px 0px'});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}
const verified=$('verifiedTab'),unverified=$('unverifiedTab'),panels=[$('verifiedPanel'),$('unverifiedPanel')],tabs=[verified,unverified];
function setTab(n,focus=false){tabs.forEach((tab,i)=>{const active=i===n;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panels[i].hidden=!active});document.querySelector('.verify-number').textContent=n?'02 / 02':'01 / 02';if(focus)tabs[n].focus()}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setTab(i));tab.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setTab(1-i,true)}})});
const copy=$('oversightCopy'),heading=$('oversightHeading'),radar=$('radarText'),sweep=$('sweepPath');
const modes={ban:{heading:'الحظر القانوني موجود',text:'تلتزم الدول الأطراف بعدم تطوير الأسلحة البيولوجية أو إنتاجها أو حيازتها لأغراض عدائية. وتوجد تدابير لبناء الثقة وسبل لإثارة المخاوف بين الدول.',radar:'حظر'},verify:{heading:'التفتيش الدوري غير مُلزِم',text:'لا تفرض الاتفاقية نظاماً دولياً منتظماً للتحقق من الامتثال داخل المنشآت. توجد آليات دولية للنظر في مزاعم الاستخدام، لكنها ليست بديلاً عن نظام تفتيش دوري شامل.',radar:'ثغرة'}};
document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{const mode=btn.dataset.mode,d=modes[mode];heading.textContent=d.heading;copy.textContent=d.text;radar.textContent=d.radar;sweep.classList.toggle('no-verify',mode==='verify');document.querySelectorAll('[data-mode]').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}));
const share=$('sharePanel'),shareToggle=$('shareToggle'),footerShare=$('footerShare'),status=$('shareStatus');
const localPreview=location.protocol==='file:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.protocol==='about:';
const actual=localPreview?'':location.href;
const title='السلاح الذي لا يُرى';
$('waLink').href='https://wa.me/?text='+encodeURIComponent(actual?`${title} ${actual}`:title);
$('tgLink').href='https://t.me/share/url?url='+encodeURIComponent(actual)+'&text='+encodeURIComponent(title);
$('xLink').href='https://x.com/intent/tweet?url='+encodeURIComponent(actual)+'&text='+encodeURIComponent(title);
$('fbLink').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(actual);
function closeShare(){share.hidden=true;shareToggle.setAttribute('aria-expanded','false')}
function openShare(){share.hidden=false;shareToggle.setAttribute('aria-expanded','true');status.textContent=localPreview?'هذه نسخة محلية. يمكنك مشاركة عنوان التحقيق، أما رابطه العام فيحتاج إلى نشر الموقع.':'';share.querySelector('a').focus()}
shareToggle.addEventListener('click',()=>share.hidden?openShare():closeShare());
footerShare.addEventListener('click',()=>{if(navigator.share&&!localPreview){navigator.share({title,url:actual}).catch(()=>openShare())}else{openShare();window.scrollTo({top:0,behavior:reduce.matches?'instant':'smooth'})}});
$('copyLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(actual||title);status.textContent=actual?'نُسخ رابط الصفحة.':'نُسخ عنوان التحقيق. الرابط العام غير متاح قبل النشر.'}catch{const field=document.createElement('textarea');field.value=actual||title;document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();status.textContent=ok?(actual?'نُسخ الرابط.':'نُسخ عنوان التحقيق.'): 'تعذّر النسخ. يمكنك نسخ عنوان الصفحة يدوياً.'}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!share.hidden){closeShare();shareToggle.focus()}});
document.addEventListener('pointerdown',e=>{if(!share.hidden&&!share.contains(e.target)&&e.target!==shareToggle&&e.target!==footerShare)closeShare()});

const visualNodes=[...document.querySelectorAll('.story-illustration')];
const visualDialog=$('illustrationDialog'),large=$('illustrationLarge'),visualTitle=$('illustrationTitle'),visualDesc=$('illustrationDescription'),visualCounter=$('illustrationCount');
let visualIndex=0,visualOpener=null;
const showVisual=n=>{
  visualIndex=(n+visualNodes.length)%visualNodes.length;
  const node=visualNodes[visualIndex],pic=node.querySelector('img'),caption=node.querySelector('figcaption');
  large.src=pic.getAttribute('src');large.alt=pic.alt;
  visualTitle.textContent=caption.querySelector('strong')?.textContent||'تفاصيل الرسم';
  visualDesc.textContent=(caption.querySelector('small')?.textContent||'رسم تعبيري غير وثائقي')+' جميع رسومات الموقع إيحائية وليست صوراً لأشخاص أو أحداث محددة.';
  visualCounter.textContent=String(visualIndex+1).padStart(2,'0')+' / '+String(visualNodes.length).padStart(2,'0');
};
visualNodes.forEach((node,n)=>node.querySelector('.visual-expand')?.addEventListener('click',e=>{visualOpener=e.currentTarget;showVisual(n);if(!visualDialog.open)visualDialog.showModal()}));
$('closeIllustration')?.addEventListener('click',()=>visualDialog.close());
$('previousIllustration')?.addEventListener('click',()=>showVisual(visualIndex-1));
$('nextIllustration')?.addEventListener('click',()=>showVisual(visualIndex+1));
visualDialog?.addEventListener('click',e=>{if(e.target===visualDialog)visualDialog.close()});
visualDialog?.addEventListener('close',()=>{visualOpener?.focus()});
visualDialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showVisual(visualIndex+1)}else if(e.key==='ArrowRight'){e.preventDefault();showVisual(visualIndex-1)}});
})();
