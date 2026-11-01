/* LGX1: league pages - pills Table / Results / Fixtures / Trends / FAQs, each showing its own dropdowns */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var MAP=[[/home table|away table|league table/i,'table'],[/match reports|biggest wins|highest|results/i,'results'],[/upcoming|fixtures/i,'fixtures'],[/trend/i,'trends'],[/quick answers|faq/i,'faqs']];
  var TABS=[['table','Table'],['results','Results'],['fixtures','Fixtures'],['trends','Trends'],['faqs','FAQs']];
  var secs=[], links={}, nav=null, P=location.pathname;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function css(){
    var s=document.createElement('style');
    s.textContent='.lgx-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:14px 0;padding:2px 0 4px;grid-column:1/-1}.lgx-tabs::-webkit-scrollbar{display:none}'+
      '.lgx-tabs a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+';white-space:nowrap}'+
      '.lgx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.lgx-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.lgx-off{display:none'+IMP+'}';
    document.head.appendChild(s);
  }
  function show(k, push){
    if(links[k]==null) k='table';
    var first=true;
    secs.forEach(function(s){
      var on=s._lgx==k; s.el.classList.toggle('lgx-off', on==false);
      if(on && s.det && s.el.getAttribute('data-lgx-seen')==null){ s.det.open=first; s.el.setAttribute('data-lgx-seen','1'); }
      if(on) first=false;
    });
    Object.keys(links).forEach(function(t){ links[t].classList.toggle('on', t==k); links[t].setAttribute('aria-selected', t==k ? 'true' : 'false'); });
    if(push) history.pushState({lgx:k},'',P+(k=='table' ? '' : '?tab='+k));
  }
  function build(){
    var els=Array.prototype.filter.call(document.querySelectorAll('section.c'),function(s){ return s.querySelector('details.lg2-acc > summary'); });
    if(els.length<3) return false;
    css();
    var used={};
    secs=els.map(function(el){
      var t=txt(el.querySelector('details.lg2-acc > summary')), k='table';
      for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(t)){ k=MAP[i][1]; break; } }
      used[k]=1; el.setAttribute('role','tabpanel');
      return {el:el, _lgx:k, det:el.querySelector('details.lg2-acc'), t:t};
    });
    secs.sort(function(a,b){ return (/league table|match reports/i.test(b.t) ? 1 : 0) - (/league table|match reports/i.test(a.t) ? 1 : 0); });
    nav=document.createElement('nav'); nav.className='lgx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','League sections');
    els[0].parentNode.insertBefore(nav, els[0]);
    TABS.forEach(function(tb){
      if(used[tb[0]]==null) return;
      var a=document.createElement('a'); a.href=P+(tb[0]=='table' ? '' : '?tab='+tb[0]); a.textContent=tb[1]; a.setAttribute('role','tab');
      a.addEventListener('click',function(e){ e.preventDefault(); show(tb[0], true); });
      nav.appendChild(a); links[tb[0]]=a;
    });
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    show(m ? m[1] : 'table', false);
    return true;
  }
  window.addEventListener('popstate',function(){ if(nav==null) return; var m=location.search.match(/[?&]tab=([a-z]+)/); show(m ? m[1] : 'table', false); });
  var k=0;
  (function wait(){ k++; if(build() || k>40){ document.documentElement.classList.add('lgx-ready'); return; } setTimeout(wait,120); })();
})();
