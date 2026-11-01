/* MT1: Me tidy - shorter Today, one copy of each card, tab links */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var TABS=['today','teams','progress','settings'];
  function $(id){ return document.getElementById(id); }
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function css(){
    if($('mt-css')) return;
    var s=document.createElement('style'); s.id='mt-css';
    s.textContent='#mh-cards>article[data-mt-hide="1"]:not([data-mt-open="1"]){display:none'+IMP+'}'+
      '#mh-cards>article[data-mt-dup="1"]{display:none'+IMP+'}'+
      '.mt-x{display:flex;flex-direction:column;gap:0}'+
      '.mt-x-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}'+
      '.mt-x-tabs button{min-height:40px;padding:8px 14px;border-radius:999px;border:1px solid #1e3157;background:transparent;color:#c5d2e8;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer}'+
      '.mt-x-tabs button[aria-pressed="true"]{background:#22d3ee;color:#04222a;border-color:#22d3ee;font-weight:700}'+
      '.mt-x>article:not(.mt-on){display:none'+IMP+'}'+
      '.mt-x-tabs button:focus-visible,#mh .mh-tabs button:focus-visible,#mh-list a.mh-li:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '[data-mt-beta="1"]{display:none'+IMP+'}'+
      '@media (min-width:900px){#page .profile-hero,#page [data-mh-t="settings"] .profile-hero{position:relative'+IMP+';top:auto'+IMP+';z-index:auto'+IMP+'}}'; /* MT2 */
    document.head.appendChild(s);
  }
  function kind(a){
    var t=txt(a).slice(0,70).toUpperCase();
    if(/^YOUR CLUB/.test(t)) return 'club';
    if(/TRIVIA/.test(t)) return 'trivia';
    if(/GUESS THE PLAYER/.test(t)) return 'gtp';
    if(/IN HISTORY|ON THIS DAY/.test(t)) return 'otd';
    if(/DID YOU KNOW/.test(t)) return 'dyk';
    if(/QUOTE/.test(t)) return 'quote';
    if(/PICKED FOR YOU/.test(t)) return 'stories';
    return '';
  }
  var XLAB={otd:'This week in history', dyk:'Did you know', quote:'Quote'};
  function extras(cards){
    var list=cards.filter(function(a){ return XLAB[kind(a)]; });
    var box=document.querySelector('#mh-cards>.mt-x');
    if(box==null){
      if(list.length<2) return;
      box=document.createElement('div'); box.className='mt-x';
      box.innerHTML='<div class="mt-x-tabs" role="group" aria-label="Daily extras"></div>';
      list[0].parentNode.insertBefore(box, list[0]);
      box.addEventListener('click',function(e){
        var b=e.target.closest('button[data-x]'); if(b==null) return;
        pick(box, b.getAttribute('data-x'));
      });
    }
    var bar=box.firstChild, added=false;
    list.forEach(function(a){
      var k=kind(a);
      if(a.parentNode===box) return;
      box.appendChild(a); a.setAttribute('data-mt-x',k); added=true;
      if(bar.querySelector('[data-x="'+k+'"]')==null){
        var b=document.createElement('button'); b.type='button'; b.setAttribute('data-x',k);
        b.textContent=XLAB[k]; b.setAttribute('aria-pressed','false'); bar.appendChild(b);
      }
    });
    if(added && box.querySelector('article.mt-on')==null){
      var first=bar.querySelector('button'); if(first) pick(box, first.getAttribute('data-x'));
    }
  }
  function pick(box,k){
    Array.prototype.forEach.call(box.querySelectorAll('article[data-mt-x]'),function(a){
      if(a.getAttribute('data-mt-x')==k) a.classList.add('mt-on'); else a.classList.remove('mt-on');
    });
    Array.prototype.forEach.call(box.querySelectorAll('.mt-x-tabs button'),function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-x')==k ? 'true' : 'false');
    });
  }
  function beta(){
    Array.prototype.forEach.call(document.querySelectorAll('body *'),function(e){
      if(e.children.length) return;
      var t=txt(e);
      if(t=='Beta' || t=='BETA'){
        if(e.closest('#drawer,#drawerList,.bottom-nav,#bottom-nav-mount,footer')) return;
        if(e.getAttribute('data-mt-beta')=='1') return;
        e.setAttribute('data-mt-beta','1');
      }
    });
  }
  function sweep(){
    var box=$('mh-cards'); if(box==null) return;
    css(); beta();
    var pending={};
    Array.prototype.forEach.call(document.querySelectorAll('#mh-list a.mh-li'),function(a){
      pending[(a.getAttribute('href')||'').replace('#','')]=1;
    });
    var cards=Array.prototype.slice.call(box.querySelectorAll(':scope>article'));
    var next=$('mh-next'), nextHasPick = next ? /YOUR PREDICTION/i.test(txt(next)) : false;
    cards.forEach(function(a){
      var k=kind(a);
      if(k=='club'){
        var dup = nextHasPick ? '1' : '0';
        if(a.getAttribute('data-mt-dup') !== dup) a.setAttribute('data-mt-dup',dup);
      }
      if(k=='trivia' || k=='gtp'){
        var h = pending[a.id] ? '1' : '0';
        if(a.getAttribute('data-mt-hide') !== h) a.setAttribute('data-mt-hide',h);
      }
      if(k=='stories'){
        var teams=document.querySelector('#page>[data-mh-t="teams"]');
        if(teams && a.parentNode !== teams) teams.appendChild(a);
      }
    });
    extras(cards);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest ? e.target.closest('#mh-list a.mh-li') : null;
    if(a){
      var el=document.querySelector(a.getAttribute('href'));
      if(el==null) return;
      if(el.getAttribute('data-mt-dup')=='1'){
        var n=$('mh-next');
        if(n){ e.preventDefault(); e.stopPropagation(); n.scrollIntoView({behavior:'smooth',block:'start'}); }
        return;
      }
      if(el.getAttribute('data-mt-hide')=='1') el.setAttribute('data-mt-open','1');
      return;
    }
    var b=e.target.closest ? e.target.closest('#mh [data-tab],#mh [data-go]') : null;
    if(b){
      var t=b.getAttribute('data-tab') || b.getAttribute('data-go');
      if(TABS.indexOf(t)>=0) history.replaceState(null,'','/me/?tab='+t);
    }
  },true);
  function urlTab(){
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    if(m && TABS.indexOf(m[1])>=0) return m[1];
    if(/^#(favourites|saved)/.test(location.hash)) return 'progress';
    if(/^#(alerts|notifications)/.test(location.hash)) return 'settings';
    return null;
  }
  function openFromUrl(){
    var t=urlTab(); if(t==null) return;
    var b=document.querySelector('#mh [data-tab="'+t+'"]'); if(b) b.click();
    setTimeout(function(){
      if(/^#(favourites|saved)/.test(location.hash)){
        var sv=Array.prototype.filter.call(document.querySelectorAll('#mePills button,#mePills a'),function(x){ return /Saved/i.test(txt(x)); })[0];
        if(sv){ sv.click(); sv.scrollIntoView({behavior:'smooth',block:'center'}); }
      }
      if(/^#(alerts|notifications)/.test(location.hash)){
        var p=$('push-btn') || $('push-status');
        if(p){ var c=p.closest('section,.card,div') || p; c.scrollIntoView({behavior:'smooth',block:'start'}); }
      }
    },400);
  }
  var k=0, done=false, t=null;
  (function wait(){
    k++;
    if($('mh') && $('mh-cards')){
      sweep();
      if(done==false){ done=true; openFromUrl(); }
      if(window.MutationObserver){
        new MutationObserver(function(){ clearTimeout(t); t=setTimeout(sweep,120); })
          .observe(document.body,{childList:true,subtree:true});
      }
      return;
    }
    if(k<80) setTimeout(wait,150);
  })();
})();

/* MT3: Teams links open in a panel on the Me page */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var OK=/^\/(clubs?|nations|preview|matches|news|players?|player|footballiq|tournaments)(\/|$)/;
  var sh=null, fr=null, ttl=null, full=null, lastFocus=null;
  function build(){
    if(sh) return;
    var s=document.createElement('style');
    s.textContent='#mt-sh{position:fixed;inset:0;z-index:9999;display:none}#mt-sh.on{display:block}'+
      '#mt-sh .bk{position:absolute;inset:0;background:rgba(3,8,20,.6)}'+
      '#mt-sh .pn{position:absolute;left:0;right:0;bottom:0;height:92vh;background:#0b1630;border:1px solid #1e3157;border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden}'+
      '@media (min-width:900px){#mt-sh .pn{left:auto;top:0;height:auto;width:min(640px,92vw);border-radius:18px 0 0 18px}}'+
      '#mt-sh .hd{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 16px;border-bottom:1px solid #1e3157}'+
      '#mt-sh .hd b{flex:1;min-width:0;font-size:15px;color:#e6edf7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '#mt-sh .hd a{color:#22d3ee;font-size:13px;font-weight:600;text-decoration:none;padding:10px 6px}'+
      '#mt-sh .hd button{min-width:44px;min-height:44px;border-radius:12px;border:1px solid #1e3157;background:transparent;color:#e6edf7;font-size:18px;cursor:pointer}'+
      '#mt-sh .hd button:focus-visible,#mt-sh .hd a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '#mt-sh iframe{flex:1;width:100%;border:0;background:#0a1428}body.mt-lock{overflow:hidden}';
    document.head.appendChild(s);
    sh=document.createElement('div'); sh.id='mt-sh';
    sh.innerHTML='<div class="bk"></div><div class="pn" role="dialog" aria-modal="true" aria-labelledby="mt-sh-t">'+
      '<div class="hd"><b id="mt-sh-t"></b><a id="mt-sh-full" href="#">Full page ↗</a><button type="button" aria-label="Close">✕</button></div>'+
      '<iframe title="Details"></iframe></div>';
    document.body.appendChild(sh);
    fr=sh.querySelector('iframe'); ttl=sh.querySelector('#mt-sh-t'); full=sh.querySelector('#mt-sh-full');
    sh.querySelector('.bk').addEventListener('click',function(){ history.back(); });
    sh.querySelector('.hd button').addEventListener('click',function(){ history.back(); });
    fr.addEventListener('load',tidy);
    document.addEventListener('keydown',function(e){ if(e.key=='Escape' && sh.classList.contains('on')) history.back(); });
    window.addEventListener('popstate',function(){ if(sh.classList.contains('on')) close(); });
  }
  function tidy(){
    try{
      var d=fr.contentDocument; if(d==null || d.head==null) return;
      var st=d.createElement('style');
      st.textContent='body>header,body>nav,body>footer,#bottom-nav-mount,.bottom-nav,#btt,#drawer,#drawerBackdrop,#fsb,#mw-ob-backdrop{display:none'+IMP+'}'+
        'body{padding-top:0'+IMP+';padding-bottom:16px'+IMP+'}';
      d.head.appendChild(st);
      var p=fr.contentWindow.location;
      full.href=p.pathname+p.search.replace(/[?&]embed=1/,'').replace(/^&/,'?');
      var t=(d.title||'').split('|')[0].split(' - ')[0].trim(); if(t) ttl.textContent=t;
    }catch(e){}
  }
  function open(href,label){
    build(); lastFocus=document.activeElement;
    fr.src=href+(href.indexOf('?')>=0 ? '&' : '?')+'embed=1';
    ttl.textContent=label || 'Details'; full.href=href;
    sh.classList.add('on'); document.body.classList.add('mt-lock');
    history.pushState({mtSheet:1},'',location.href);
    setTimeout(function(){ var b=sh.querySelector('.hd button'); if(b) b.focus(); },60);
  }
  function close(){
    sh.classList.remove('on'); document.body.classList.remove('mt-lock');
    fr.src='about:blank';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var a=e.target.closest ? e.target.closest('a[href]') : null; if(a==null) return;
    if(a.closest('#page>[data-mh-t="teams"],#mh .mh-chips,#mh-next')==null) return;
    var url; try{ url=new URL(a.getAttribute('href'), location.href); }catch(x){ return; }
    if((url.origin==location.origin)==false){ a.target='_blank'; a.rel='noopener'; return; }
    if(OK.test(url.pathname)==false) return;
    e.preventDefault(); e.stopPropagation();
    open(url.pathname+url.search, (a.textContent||'').replace(/\s+/g,' ').trim().slice(0,60));
  },true);
})();
