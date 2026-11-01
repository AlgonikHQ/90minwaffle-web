/* PMX1: match previews - hero, Waffle Take and prediction on top; tabs Forecast / Form & table / Head to head / FAQs */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var MAP=[[/forecast|model/i,'forecast'],[/form|table/i,'form'],[/head to head|h2h/i,'h2h'],[/faq/i,'faqs']];
  var TABS=[['forecast','Forecast'],['form','Form & table'],['h2h','Head to head'],['faqs','FAQs']];
  var panes=[], links={}, nav=null, P=location.pathname;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function css(){
    var s=document.createElement('style');
    s.textContent='.pmx-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:18px 0 12px;padding:2px 0 4px}.pmx-tabs::-webkit-scrollbar{display:none}'+
      '.pmx-tabs a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+';white-space:nowrap}'+
      '.pmx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.pmx-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.pmx-pane{display:none}.pmx-pane.on{display:block}.pmx-pane>h2:first-child{margin-top:4px}'+
      'a[href^="/clubs/"]{text-decoration:none'+IMP+'}';
    document.head.appendChild(s);
  }
  function show(k, push){
    var hit=panes.filter(function(p){ return p.k==k; })[0] || panes[0];
    panes.forEach(function(p){ p.el.classList.toggle('on', p===hit); });
    Object.keys(links).forEach(function(t){ links[t].classList.toggle('on', t==hit.k); links[t].setAttribute('aria-selected', t==hit.k ? 'true' : 'false'); });
    if(push) history.pushState({pmx:hit.k},'',P+(hit.k=='forecast' ? '' : '?tab='+hit.k));
  }
  function build(){
    var hs=Array.prototype.filter.call(document.querySelectorAll('h2'),function(h){ return h.closest('header,nav,footer,details,aside,blockquote')==null; });
    var cnt=[], best=null, bn=0;
    hs.forEach(function(h){ var e=cnt.filter(function(c){ return c.p===h.parentNode; })[0]; if(e) e.n++; else cnt.push({p:h.parentNode,n:1}); });
    cnt.forEach(function(c){ if(c.n>bn){ bn=c.n; best=c.p; } });
    if(best==null || bn<3) return false;
    var mine=hs.filter(function(h){ return h.parentNode===best; });
    var secs=mine.map(function(h,i){ var nodes=[], n=h.nextSibling, stop=mine[i+1]||null; while(n && n!==stop){ nodes.push(n); n=n.nextSibling; } return {h:h, nodes:nodes, t:txt(h)}; });
    var used={}, first=null;
    css();
    secs.forEach(function(s){
      if(/waffle take|^more$|prediction/i.test(s.t)) return;
      var k=null; for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(s.t)){ k=MAP[i][1]; break; } }
      if(k==null || used[k]) return;
      var pane=document.createElement('div'); pane.className='pmx-pane'; pane.setAttribute('role','tabpanel');
      best.insertBefore(pane, s.h); pane.appendChild(s.h); s.nodes.forEach(function(n){ pane.appendChild(n); });
      used[k]=1; panes.push({k:k, el:pane}); if(first==null) first=pane;
    });
    if(panes.length<2) return true;
    nav=document.createElement('nav'); nav.className='pmx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Preview sections');
    best.insertBefore(nav, first);
    TABS.forEach(function(t){
      if(used[t[0]]==null) return;
      var a=document.createElement('a'); a.href=P+(t[0]=='forecast' ? '' : '?tab='+t[0]); a.textContent=t[1]; a.setAttribute('role','tab');
      a.addEventListener('click',function(e){ e.preventDefault(); show(t[0], true); });
      nav.appendChild(a); links[t[0]]=a;
    });
    var m=location.search.match(/[?&]tab=([a-z0-9]+)/);
    show(m ? m[1] : 'forecast', false);
    return true;
  }
  window.addEventListener('popstate',function(){ if(nav==null) return; var m=location.search.match(/[?&]tab=([a-z0-9]+)/); show(m ? m[1] : 'forecast', false); });
  var k=0;
  (function wait(){ k++; if(build() || k>40){ document.documentElement.classList.add('pmx-ready'); return; } setTimeout(wait,120); })();
})();
