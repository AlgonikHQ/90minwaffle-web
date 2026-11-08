function __fxUid(b){var S=window.__fxIds||(window.__fxIds={}),id=b,n=2;while(S[id]||document.getElementById(id)){id=b+'-'+(n++);}S[id]=1;return id;} /* QFIX_UID_20261108 */
/* FX1: fold long pages - About (dropdowns), Corrections (dropdowns, newest open), Weekly reports (tabs with URLs) */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var P=location.pathname.replace(/\/*$/,'/');
  var CFG={'/about/':{lvl:'h2',mode:'acc',open:1},'/corrections/':{lvl:'h3',mode:'panels',show:4},
           '/weekly-reports/':{lvl:'h3',mode:'tabs',def:/week by week/i}};
  var cfg=CFG[P]; if(cfg==null) return;
  var panes=[], secs=null;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function slug(t){ return (t.toLowerCase().replace(/&/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').split('-').slice(0,3).join('-')) || 'part'; }
  function css(){
    var s=document.createElement('style');
    s.textContent='.fx-acc{border:1px solid #1e3157;border-radius:14px;background:#0d1830;margin:0 0 10px;padding:0 14px}'+
      '.fx-acc>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:48px;padding:6px 0}'+
      '.fx-acc>summary::-webkit-details-marker{display:none}'+
      '.fx-acc>summary>h2,.fx-acc>summary>h3{margin:0'+IMP+';font-size:16px'+IMP+';line-height:1.35}'+
      '.fx-acc>summary::after{content:"\\25be";color:#22d3ee;flex:none;transition:transform .2s}.fx-acc[open]>summary::after{transform:rotate(180deg)}'+
      '.fx-acc>summary:focus-visible{outline:2px solid #22d3ee;outline-offset:2px;border-radius:8px}.fx-body{padding:0 0 14px}'+
      '.fx-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}'+
      '.fx-tabs a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+'}'+
      '.fx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.fx-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.th-panel.fx-pwrap{padding:0'+IMP+';border:0'+IMP+';background:transparent'+IMP+';box-shadow:none'+IMP+';margin:0 0 8px'+IMP+'}'+'.fx-st{display:flex;flex-direction:column;gap:3px;min-width:0}.fx-st small{color:#9fb0cc;font-size:12px;font-weight:500}'+'.fx-older{margin-top:14px}.fx-older>summary>h3{color:#22d3ee'+IMP+'}.fx-older>.fx-body{padding-top:4px}'+'.fx-pane{display:none}.fx-pane.on{display:block}.fx-pane>h3:first-child{display:none}';
    document.head.appendChild(s);
  }
  function find(){
    var hs=Array.prototype.filter.call(document.querySelectorAll(cfg.lvl),function(h){ return h.closest('header,nav,footer,#drawer,.fx-acc,.fx-pane')==null; });
    var best=null, bn=0, cnt=[];
    hs.forEach(function(h){ var e=cnt.filter(function(c){ return c.p===h.parentNode; })[0]; if(e) e.n++; else cnt.push({p:h.parentNode,n:1}); });
    cnt.forEach(function(c){ if(c.n>bn){ bn=c.n; best=c.p; } });
    if(best==null || bn<2) return null;
    var mine=hs.filter(function(h){ return h.parentNode===best; });
    return mine.map(function(h,i){
      var nodes=[], n=h.nextSibling, stop=mine[i+1]||null;
      while(n && n!==stop){ nodes.push(n); n=n.nextSibling; }
      return {h:h, nodes:nodes, title:txt(h), parent:best};
    });
  }
  function accordion(){
    secs.forEach(function(s,i){
      var d=document.createElement('details'); d.className='fx-acc'; d.id=__fxUid('fx-'+slug(s.title)); if(i<cfg.open) d.open=true;
      var sm=document.createElement('summary'); s.parent.insertBefore(d, s.h); sm.appendChild(s.h); d.appendChild(sm);
      var body=document.createElement('div'); body.className='fx-body'; s.nodes.forEach(function(n){ body.appendChild(n); }); d.appendChild(body);
    });
    if(location.hash){ var t=document.getElementById(location.hash.slice(1)); var d=t ? (t.tagName=='DETAILS' ? t : t.closest('details.fx-acc')) : null; if(d){ d.open=true; setTimeout(function(){ d.scrollIntoView({block:'start'}); },80); } }
  }
  function show(k, push){
    var hit=panes.filter(function(p){ return p.k==k; })[0] || panes[0];
    panes.forEach(function(p){ p.el.classList.toggle('on', p===hit); p.a.classList.toggle('on', p===hit); p.a.setAttribute('aria-selected', p===hit ? 'true' : 'false'); });
    if(push) history.pushState({fx:hit.k},'',P+'?tab='+hit.k);
  }
  function tabs(){
    var nav=document.createElement('nav'); nav.className='fx-tabs'; nav.setAttribute('role','tablist');
    secs[0].parent.insertBefore(nav, secs[0].h);
    secs.forEach(function(s){
      var k=slug(s.title), pane=document.createElement('div'); pane.className='fx-pane'; pane.setAttribute('role','tabpanel');
      s.parent.insertBefore(pane, s.h); pane.appendChild(s.h); s.nodes.forEach(function(n){ pane.appendChild(n); });
      var a=document.createElement('a'); a.href=P+'?tab='+k; a.setAttribute('role','tab'); a.textContent=s.title.replace(/\s*\(\d+\)\s*$/,'');
      a.addEventListener('click',function(e){ e.preventDefault(); show(k, true); });
      nav.appendChild(a); panes.push({k:k, el:pane, a:a, title:s.title});
    });
    var m=location.search.match(/[?&]tab=([a-z0-9-]+)/), def=panes.filter(function(p){ return cfg.def && cfg.def.test(p.title); })[0];
    show(m ? m[1] : (def ? def.k : panes[0].k), false);
    window.addEventListener('popstate',function(){ var m=location.search.match(/[?&]tab=([a-z0-9-]+)/); show(m ? m[1] : (def ? def.k : panes[0].k), false); });
  }
  /* FX2_PANELS: Corrections - newest N stay open, the rest fold into one dropdown, each its own mini dropdown */
  function panelsFind(){
    var ps=Array.prototype.filter.call(document.querySelectorAll('.th-panel'),function(p){ return p.querySelector('h3'); });
    return ps.length>cfg.show ? ps : null;
  }
  function mini(p){
    var h=p.querySelector('h3'), note=p.querySelector('.th-note');
    var d=document.createElement('details'); d.className='fx-acc fx-mini'; d.id=__fxUid('fx-'+slug(txt(h)));
    var sm=document.createElement('summary'), w=document.createElement('span'); w.className='fx-st';
    var date = note ? txt(note).split(' \u00b7 ')[0] : '';
    w.appendChild(h);
    if(date){ var sd=document.createElement('small'); sd.textContent=date; w.appendChild(sd); }
    sm.appendChild(w); d.appendChild(sm);
    var body=document.createElement('div'); body.className='fx-body';
    while(p.firstChild) body.appendChild(p.firstChild);
    d.appendChild(body); p.appendChild(d); p.classList.add('fx-pwrap');
  }
  function panels(){
    var old=secs.slice(cfg.show), last=secs[cfg.show-1];
    var box=document.createElement('details'); box.className='fx-acc fx-older'; box.id='older';
    box.innerHTML='<summary><h3>Older corrections \u00b7 '+old.length+'</h3></summary>';
    var body=document.createElement('div'); body.className='fx-body'; box.appendChild(body);
    last.parentNode.insertBefore(box, last.nextSibling);
    old.forEach(function(p){ mini(p); body.appendChild(p); });
    if(location.hash){ var t=document.getElementById(location.hash.slice(1));
      if(t && box.contains(t)){ box.open=true; var d=t.closest('details.fx-mini'); if(d) d.open=true; setTimeout(function(){ (d||box).scrollIntoView({block:'start'}); },80); } }
  }
  var k=0;
  (function wait(){
    k++; secs = cfg.mode=='panels' ? panelsFind() : find();
    if(secs){ css(); if(cfg.mode=='tabs') tabs(); else if(cfg.mode=='panels') panels(); else accordion(); document.documentElement.classList.add('fx-ready'); return; }
    if(k>40){ document.documentElement.classList.add('fx-ready'); return; }
    setTimeout(wait,120);
  })();
})();
