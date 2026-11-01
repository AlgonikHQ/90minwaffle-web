/* CLX1: club pages - hero on top, tabs Overview / Fixtures / Table & history / Squad & stats / About, each with its own URL */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var MAP=[[/this season/i,'overview'],[/next match/i,'overview'],[/recent results/i,'overview'],[/upcoming|fixtures/i,'fixtures'],
           [/past seasons/i,'table'],[/squad/i,'squad'],[/top scorers|top assists/i,'squad'],[/^about|faqs/i,'about'],[/table/i,'table']];
  var TABS=[['overview','Overview'],['fixtures','Fixtures'],['table','Table & history'],['squad','Squad & stats'],['about','About']];
  var cards=[], links={}, nav=null, P=location.pathname;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function head(c){ var h=c.querySelector('h2,summary'); return h ? txt(h) : ''; }
  function css(){
    var s=document.createElement('style');
    s.textContent='.clx-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:14px 0;padding:2px 0 4px}.clx-tabs::-webkit-scrollbar{display:none}'+
      '.clx-tabs a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+';white-space:nowrap}'+
      '.clx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.clx-tabs a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.card.clx-off{display:none'+IMP+'}.clx-dup{display:none'+IMP+'}';
    document.head.appendChild(s);
  }
  function show(k, push){
    if(links[k]==null) k='overview';
    cards.forEach(function(c){ c.classList.toggle('clx-off', c._clx!==k); });
    Object.keys(links).forEach(function(t){ links[t].classList.toggle('on', t==k); links[t].setAttribute('aria-selected', t==k ? 'true' : 'false'); });
    if(k=='squad') cards.forEach(function(c){ if(c._clx=='squad'){ var d=c.tagName=='DETAILS' ? c : c.querySelector('details'); if(d) d.open=true; } });
    if(push) history.pushState({clx:k},'',P+(k=='overview' ? '' : '?tab='+k));
  }
  function dedupeBadge(){
    var hero=document.querySelector('.hero'), img=hero ? hero.querySelector('img') : null; if(img==null) return;
    var src=img.getAttribute('src');
    Array.prototype.forEach.call(document.querySelectorAll('img'),function(i){
      if(i===img || i.getAttribute('src')!==src || i.closest('header,nav,.bottom-nav,#bottom-nav-mount')) return;
      i.classList.add('clx-dup');
    });
  }
  function build(){
    cards=Array.prototype.filter.call(document.querySelectorAll('.card'),function(c){ return c.parentElement.closest('.card')==null && head(c) && c.closest('.hero')==null; });
    if(cards.length<4) return false;
    css(); dedupeBadge();
    var used={};
    cards.forEach(function(c){ var t=head(c), k='overview'; for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(t)){ k=MAP[i][1]; break; } } c._clx=k; used[k]=1; c.setAttribute('role','tabpanel'); });
    /* CLX2_NEXT: the Fixtures tab starts with the next match too (Upcoming deliberately lists the games after it) */
    var nx=cards.filter(function(c){ return /next match/i.test(head(c)); })[0], up=cards.filter(function(c){ return c._clx=='fixtures'; })[0];
    if(nx && up){ var cl=nx.cloneNode(true); cl.removeAttribute('id'); cl._clx='fixtures'; cl.setAttribute('role','tabpanel'); up.parentNode.insertBefore(cl, up); cards.push(cl); }
    nav=document.createElement('nav'); nav.className='clx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Club sections');
    var hero=document.querySelector('.hero');
    var anchor=(hero && hero.parentNode===cards[0].parentNode) ? hero.nextSibling : cards[0];
    cards[0].parentNode.insertBefore(nav, anchor);
    TABS.forEach(function(t){
      if(used[t[0]]==null) return;
      var a=document.createElement('a'); a.href=P+(t[0]=='overview' ? '' : '?tab='+t[0]); a.textContent=t[1]; a.setAttribute('role','tab');
      a.addEventListener('click',function(e){ e.preventDefault(); show(t[0], true); });
      nav.appendChild(a); links[t[0]]=a;
    });
    document.addEventListener('click',function(e){
      var a=e.target.closest ? e.target.closest('a[href^="#"]') : null; if(a==null) return;
      var el=document.getElementById(a.getAttribute('href').slice(1)); if(el==null) return;
      var c=cards.filter(function(x){ return x.contains(el); })[0]; if(c==null) return;
      e.preventDefault(); show(c._clx, true); setTimeout(function(){ el.scrollIntoView({behavior:'smooth',block:'start'}); },60);
    });
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    show(m ? m[1] : 'overview', false);
    return true;
  }
  /* FILLBADGE_20261031: badge only while the club has no season data */
  (function(){ var k=0; (function w(){ k++;
    var b=document.querySelectorAll('.nmw-fill'); if(b.length==0){ if(k<25) setTimeout(w,200); return; }
    var played=0; Array.prototype.forEach.call(document.querySelectorAll('.card'),function(c){ var h=c.querySelector('h2'); if(h && /this season/i.test(h.textContent)){ var m=(c.textContent||'').match(/(\d+)\s*Played/i); if(m) played=+m[1]; } });
    if(played>0) (function(){ if(document.getElementById('nmw-full-css')==null){ var st=document.createElement('style'); st.id='nmw-full-css'; st.textContent='html.nmw-full .nmw-fill{display:none'+String.fromCharCode(32,33)+'important}'; document.head.appendChild(st); } document.documentElement.classList.add('nmw-full'); })();
  })(); })();
  window.addEventListener('popstate',function(){ if(nav==null) return; var m=location.search.match(/[?&]tab=([a-z]+)/); show(m ? m[1] : 'overview', false); });
  var k=0;
  (function wait(){ k++; if(build() || k>40){ document.documentElement.classList.add('clx-ready'); return; } setTimeout(wait,120); })();
})();
