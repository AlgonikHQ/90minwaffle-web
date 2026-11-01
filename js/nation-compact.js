/* NAX2: nation pages - tabs Overview / Players / FAQs; survives the page's own redraws; duplicate flag hidden */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var MAP=[[/faq/i,'faqs'],[/players|squad|caps|scorers/i,'players'],[/next match|recent|results|fixtures/i,'overview']];
  var TABS=[['overview','Overview'],['players','Players'],['faqs','FAQs']];
  var P=location.pathname, cur=null, t=null, done=false;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function head(c){ var h=c.querySelector('h2') || c.querySelector('summary'); return h ? txt(h) : ''; }
  function css(){
    if(document.getElementById('nax-css')) return;
    var s=document.createElement('style'); s.id='nax-css';
    s.textContent='.nax-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:14px 0;padding:2px 0 4px}.nax-tabs::-webkit-scrollbar{display:none}'+
      '.nax-tabs a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+';white-space:nowrap}'+
      '.nax-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.nax-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.nax-off{display:none'+IMP+'}.pc>img{display:none'+IMP+'}';
    document.head.appendChild(s);
  }
  function cards(){
    var pc=document.querySelector('.pc'); if(pc==null) return [];
    return Array.prototype.filter.call(pc.querySelectorAll('section.card'),function(c){ return c.closest('.hero')==null && head(c); });
  }
  function key(c){ var h=head(c); for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(h)) return MAP[i][1]; } return 'overview'; }
  function apply(k){
    var cs=cards(), used={};
    cs.forEach(function(c){ used[key(c)]=1; });
    if(used[k]==null) k='overview';
    cur=k;
    cs.forEach(function(c){ var me=key(c); c.classList.toggle('nax-off', me!==k);
      if(me==k && k=='players'){ var d=c.querySelector('details'); if(d && c.getAttribute('data-nax-open')==null){ d.open=true; c.setAttribute('data-nax-open','1'); } } });
    Array.prototype.forEach.call(document.querySelectorAll('.pc .two'),function(r){
      var any=Array.prototype.some.call(r.querySelectorAll('section.card'),function(c){ return c.classList.contains('nax-off')==false; });
      r.classList.toggle('nax-off', any==false);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nax-tabs a'),function(a){ var on=a.getAttribute('data-k')==k; a.classList.toggle('on', on); a.setAttribute('aria-selected', on ? 'true' : 'false'); });
    return used;
  }
  function build(){
    css();
    var cs=cards(); if(cs.length<3) return false;
    var pc=document.querySelector('.pc'), nav=pc.querySelector('.nax-tabs');
    var used={}; cs.forEach(function(c){ used[key(c)]=1; });
    if(nav==null){
      nav=document.createElement('nav'); nav.className='nax-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Nation sections');
      var a0=cs[0]; while(a0.parentNode && a0.parentNode!==pc) a0=a0.parentNode;
      pc.insertBefore(nav, a0);
      TABS.forEach(function(tb){
        if(used[tb[0]]==null) return;
        var a=document.createElement('a'); a.href=P+(tb[0]=='overview' ? '' : '?tab='+tb[0]); a.textContent=tb[1]; a.setAttribute('role','tab'); a.setAttribute('data-k',tb[0]);
        a.addEventListener('click',function(e){ e.preventDefault(); apply(tb[0]); history.pushState({nax:tb[0]},'',a.getAttribute('href')); });
        nav.appendChild(a);
      });
    }
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    apply(cur || (m ? m[1] : 'overview'));
    if(done==false){ done=true; document.documentElement.classList.add('nax-ready'); }
    return true;
  }
  /* FILLBADGE_20261031: badge only while the nation has no results */
  (function(){ var k=0; (function w(){ k++;
    var b=document.querySelectorAll('.nmw-fill'); if(b.length==0){ if(k<40) setTimeout(w,250); return; }
    var rec=Array.prototype.filter.call(document.querySelectorAll('section.card'),function(c){ var h=c.querySelector('h2'); return h && /recent results/i.test(h.textContent); })[0];
    if(rec && rec.querySelectorAll('a,li,.row,div').length>2) (function(){ if(document.getElementById('nmw-full-css')==null){ var st=document.createElement('style'); st.id='nmw-full-css'; st.textContent='html.nmw-full .nmw-fill{display:none'+String.fromCharCode(32,33)+'important}'; document.head.appendChild(st); } document.documentElement.classList.add('nmw-full'); })(); else if(k<40) setTimeout(w,250);
  })(); })();
  window.addEventListener('popstate',function(){ var m=location.search.match(/[?&]tab=([a-z]+)/); cur=null; apply(m ? m[1] : 'overview'); });
  if(window.MutationObserver){
    new MutationObserver(function(){ clearTimeout(t); t=setTimeout(build,150); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  build();
  setTimeout(function(){ document.documentElement.classList.add('nax-ready'); },15000);
})();
