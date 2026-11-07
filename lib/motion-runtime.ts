/**
 * The whole scroll-motion engine: one IntersectionObserver in an inline
 * script, under 1KB, no React and no library.
 *
 * It only flips `data-in` on elements. Every reveal is a CSS transition keyed
 * to that attribute (globals.css, "Reveals"), so the compositor does the work
 * and public pages hydrate almost nothing. See the 2026-11-05 Decision Log.
 *
 * An element leaving through the BOTTOM of the viewport un-reveals (scrolling
 * up reverses the entrance, per the 2026-08-02 decision). One leaving through
 * the top stays revealed, so scrolling back up never replays what was already
 * read. The root reaches far above the viewport to get exactly that: revealed
 * means "above the line near the viewport's bottom", wherever that is, so a
 * jump can't skip past an element and leave it blank for the scroll back up.
 *
 * Also runs `[data-magnetic]` (≤ 6px, fine pointers only) and `[data-spot]`
 * (a pointer-following highlight), both as delegated listeners, and turns on
 * smooth anchor scrolling once the page has loaded, so a deep link arrives
 * rather than flying there (`html[data-smooth]` in globals.css).
 */
export const MOTION_RUNTIME = `(function(){
var d=document,S='[data-rv],[data-rv-group],[data-rv-words]';
var io=new IntersectionObserver(function(es){es.forEach(function(e){
e.target.toggleAttribute('data-in',e.isIntersecting)})},{rootMargin:'1000000px 0px -5% 0px'});
function scan(r){if(r.matches&&r.matches(S))io.observe(r);r.querySelectorAll(S).forEach(function(n){io.observe(n)})}
scan(d);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)})})}).observe(d.body,{childList:true,subtree:true});
addEventListener('load',function(){requestAnimationFrame(function(){d.documentElement.setAttribute('data-smooth','')})});
if(!matchMedia('(pointer:fine)').matches)return;
var q=matchMedia('(prefers-reduced-motion: reduce)');
function still(){return q.matches||d.documentElement.classList.contains('a11y-motion')}
var cur=null;
d.addEventListener('pointermove',function(e){var t=e.target;if(!t.closest)return;
var s=t.closest('[data-spot]');if(s&&!still()){var r=s.getBoundingClientRect();s.style.setProperty('--sx',(e.clientX-r.left)+'px');s.style.setProperty('--sy',(e.clientY-r.top)+'px')}
var m=t.closest('[data-magnetic]');if(cur&&cur!==m){cur.style.transform='';cur=null}
if(m&&!still()){var b=m.getBoundingClientRect(),x=(e.clientX-b.left-b.width/2)/b.width,y=(e.clientY-b.top-b.height/2)/b.height;
m.style.transform='translate3d('+(x*10).toFixed(1)+'px,'+(y*10).toFixed(1)+'px,0)';cur=m}},{passive:true});
d.addEventListener('pointerleave',function(){if(cur){cur.style.transform='';cur=null}},{passive:true});
})();`;
