/* TRC1: Tournaments tabs - Active, Upcoming, Archive */
(function(){
  var TABS=[['active','Active'],['upcoming','Upcoming'],['archive','Archive']];
  var host=null, panes={}, links={};
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function wide(){ return window.matchMedia('(min-width: 900px)').matches; }
  function css(){
    var s=document.createElement('style');
    s.textContent='.trc-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 16px}'+
      '.trc-tabs a{padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8;font-weight:600;font-size:14px;text-decoration:none}'+
      '.trc-tabs a.on{background:#22d3ee;color:#04222a;border-color:#22d3ee;font-weight:700}'+
      '.trc-tabs small{opacity:.75;font-weight:500;margin-left:4px}'+
      '.trc-p{display:none}.trc-p.on{display:block}.trc-p>details{margin-bottom:12px}'+
      '.trc-p[data-t="archive"]>details>summary{display:none}'+
      '.trc-empty{padding:16px;border:1px dashed #2b4573;border-radius:14px;color:#9fb0cc;font-size:14px}';
    document.head.appendChild(s);
  }
  function upcomingBlock(h){
    var sec=h.closest('section');
    if(sec && sec.querySelector('details[class*="tv2-"]')==null) return sec;
    var n=h;
    while(n.parentNode && n.parentNode.querySelector('details[class*="tv2-"]')==null) n=n.parentNode;
    var box=document.createElement('div'); box.className='trc-up';
    n.parentNode.insertBefore(box,n);
    var cur=n;
    while(cur){
      var nx=cur.nextSibling;
      if(cur.nodeType==1 && (cur.tagName=='DETAILS' || cur.querySelector('details[class*="tv2-"]'))) break;
      box.appendChild(cur); cur=nx;
    }
    return box;
  }
  function count(d){ var g=d.querySelector('.th-grid'); return g ? g.children.length : 0; }
  function show(t, push){
    if(panes[t]==null) t='active';
    TABS.forEach(function(x){
      panes[x[0]].classList.toggle('on', x[0]==t);
      links[x[0]].classList.toggle('on', x[0]==t);
    });
    if(push) history.pushState({trc:t},'', t=='active' ? '/tournaments/' : '/tournaments/?tab='+t);
  }
  function build(){
    var all=Array.prototype.slice.call(document.querySelectorAll('details[class*="tv2-"]'));
    if(all.length==0) return false;
    var archive=null, active=[];
    all.forEach(function(d){ if(/tv2-archive/.test(d.className)) archive=d; else active.push(d); });
    if(active.length==0) return false;
    var up=null;
    Array.prototype.forEach.call(document.querySelectorAll('h2,h3'),function(h){
      if(up==null && /^coming up/i.test(txt(h))) up=upcomingBlock(h);
    });
    var anchor=active[0];
    if(up && (up.compareDocumentPosition(active[0]) & 4)) anchor=up;
    host=document.createElement('div'); host.id='trc-host';
    anchor.parentNode.insertBefore(host, anchor);
    var nav=document.createElement('nav'); nav.className='trc-tabs'; nav.setAttribute('aria-label','Tournament views');
    host.appendChild(nav);
    var n={active:0, upcoming:0, archive:0};
    active.forEach(function(d){ n.active+=count(d); });
    if(archive) n.archive=count(archive);
    TABS.forEach(function(x){
      var a=document.createElement('a'); a.href=x[0]=='active' ? '/tournaments/' : '?tab='+x[0];
      a.innerHTML=x[1]+(n[x[0]] ? '<small>'+n[x[0]]+'</small>' : '');
      a.addEventListener('click',function(e){ e.preventDefault(); show(x[0], true); });
      nav.appendChild(a); links[x[0]]=a;
      var p=document.createElement('div'); p.className='trc-p'; p.setAttribute('data-t',x[0]);
      host.appendChild(p); panes[x[0]]=p;
    });
    active.forEach(function(d,i){ panes.active.appendChild(d); d.open = wide() ? true : (i==0); });
    if(up) panes.upcoming.appendChild(up);
    else panes.upcoming.innerHTML='<div class="trc-empty">Nothing starting in the next few weeks. Check back soon.</div>';
    if(archive){ panes.archive.appendChild(archive); archive.open=true; }
    else panes.archive.innerHTML='<div class="trc-empty">No finished tournaments yet.</div>';
    Array.prototype.forEach.call(document.querySelectorAll('summary'),function(s){
      var w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT,null,false), t;
      while((t=w.nextNode())) t.nodeValue=t.nodeValue.replace(/\b1 (competition|tournament)s\b/g,'1 $1');
    });
    css();
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    show(m ? m[1] : 'active', false);
    return true;
  }
  window.addEventListener('popstate',function(){
    if(host==null) return;
    var m=location.search.match(/[?&]tab=([a-z]+)/); show(m ? m[1] : 'active', false);
  });
  var k=0;
  (function wait(){
    k++;
    if(build() || k>40){ document.documentElement.classList.add('trc-ready'); return; }
    setTimeout(wait,120);
  })();
})();
