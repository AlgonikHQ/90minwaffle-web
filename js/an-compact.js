/* ANX1: Analysis hub - one section at a time, tabs with their own URL */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var NAMES=[[/match report/i,'reports','Match reports'],[/league stat/i,'league','League stats'],[/both teams|btts/i,'btts','Goals & BTTS'],
             [/tips|weekly/i,'tips','Tips & weekly'],[/more analysis/i,'more','More']];
  var tabs=[], nav=null;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function css(){
    var s=document.createElement('style');
    s.textContent='.anx-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 14px}'+
      '.anx-tabs a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+'}'+
      '.anx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}'+
      '.anx-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      'section.sec.anx-off{display:none'+IMP+'}section.sec.anx-p{margin-top:6px'+IMP+'}';
    document.head.appendChild(s);
  }
  function show(k, push){
    var hit=tabs.filter(function(t){ return t.k==k; })[0] || tabs[0];
    tabs.forEach(function(t){ t.sec.classList.toggle('anx-off', t!==hit); t.a.classList.toggle('on', t===hit); t.a.setAttribute('aria-selected', t===hit ? 'true' : 'false'); });
    if(push) history.pushState({anx:hit.k},'','/analysis/?tab='+hit.k);
    return hit;
  }
  function build(){
    var secs=Array.prototype.filter.call(document.querySelectorAll('section.sec'),function(s){ return s.querySelector('h2'); });
    if(secs.length<2) return false;
    css();
    nav=document.createElement('nav'); nav.className='anx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Analysis sections');
    secs[0].parentNode.insertBefore(nav, secs[0]);
    secs.forEach(function(sec,i){
      var t=txt(sec.querySelector('h2')), k='s'+i, label=t;
      NAMES.forEach(function(n){ if(n[0].test(t) && k.charAt(0)=='s' && k.length<4){ k=n[1]; label=n[2]; } });
      if(tabs.some(function(x){ return x.k==k; })) k=k+i;
      var a=document.createElement('a'); a.href='/analysis/?tab='+k; a.textContent=label; a.setAttribute('role','tab');
      a.addEventListener('click',function(e){ e.preventDefault(); show(k, true); });
      nav.appendChild(a); sec.classList.add('anx-p'); sec.setAttribute('role','tabpanel');
      tabs.push({k:k, a:a, sec:sec});
    });
    document.addEventListener('click',function(e){
      var a=e.target.closest ? e.target.closest('a[href^="#"]') : null; if(a==null) return;
      var id=a.getAttribute('href').slice(1); if(id=='') return;
      var el=document.getElementById(id); if(el==null) return;
      var t=tabs.filter(function(x){ return x.sec.contains(el); })[0]; if(t==null) return;
      e.preventDefault(); show(t.k, true);
      setTimeout(function(){ el.scrollIntoView({behavior:'smooth',block:'start'}); },60);
    });
    var m=location.search.match(/[?&]tab=([a-z0-9]+)/);
    show(m ? m[1] : tabs[0].k, false);
    return true;
  }
  window.addEventListener('popstate',function(){
    if(tabs.length==0) return;
    var m=location.search.match(/[?&]tab=([a-z0-9]+)/); show(m ? m[1] : tabs[0].k, false);
  });
  var k=0;
  (function wait(){
    k++;
    if(build() || k>40){ document.documentElement.classList.add('anx-ready'); return; }
    setTimeout(wait,120);
  })();
})();
