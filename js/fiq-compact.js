/* FIQC_20261031 v2: FootballIQ tabs. All sections move into one panel that re-flows per tab (no desktop gaps); each tab is a
   real link (?tab=...) with back/forward; older block placed once (cards in Tools, about/week in Explore). */
(function () {
  if (window.__fiqc) return; window.__fiqc = 1;
  var I = ' ' + String.fromCharCode(33) + 'important';
  var st = document.createElement('style'); st.id = 'fiqc-css';
  st.textContent = [
    '.fiqc-bar{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:12px 0 14px;padding:2px 0}',
    '.fiqc-tab{flex:0 0 auto;display:inline-flex;align-items:center;min-height:42px;padding:0 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8;font-size:14px;text-decoration:none}',
    '.fiqc-tab.on{background:#22d3ee;border-color:#22d3ee;color:#04222a;font-weight:700}',
    '.fiqc-off{display:none' + I + '}', '.fiqc-panel>*{margin-top:0}',
    '@media(min-width:1100px){.fiqc-panel{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px 24px;align-items:start}.fiqc-panel>.fiqc-main{grid-column:1;grid-row:1/span 30}.fiqc-panel>.fiqc-aside{grid-column:2}.fiqc-panel>.fiqc-full{grid-column:1/-1}}',
    '@media(min-width:900px){.fq2-fxlist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.fq2-fxlist>.fq2-showall,.fq2-fxlist>.fq2-sub,.fq2-fxlist>.fq2-more{grid-column:1/-1}}'
  ].join('');
  document.head.appendChild(st);
  function txt(e) { return ((e && e.textContent) || '').replace(/\s+/g, ' ').trim(); }
  function q(s) { return document.querySelector(s); }
  function secBy(re) { return [].filter.call(document.querySelectorAll('section.fq2-sec'), function (s) { return re.test(txt(s.querySelector('h2,summary'))); })[0] || null; }
  var ORDER = ['Forecasts', 'Rankings', 'Tools', 'Explore', 'Model'];
  function done() { document.documentElement.classList.add('fiqc-ready'); }
  function build() {
    if (q('.fiqc-bar')) return true;
    if (secBy(/^this week/i) == null) return false;
    var oldTools = null;
    [].forEach.call(document.querySelectorAll('.fiq-h'), function (h) { if (/^tools/i.test(txt(h))) oldTools = h.closest('section') || h.parentElement; });
    var G = {
      Forecasts: [secBy(/^this week/i), secBy(/^your club/i), secBy(/^talking points/i)],
      Rankings: [secBy(/^team rankings/i)],
      Tools: [oldTools, secBy(/^tools/i)],
      Explore: [secBy(/^seasons and competitions/i), q('.fq2-ctiles'), q('#fiq-week'), q('#about-fiq')],
      Model: [secBy(/can you trust/i), q('#fq2-how')]
    };
    var all = [];
    ORDER.forEach(function (n) { G[n] = G[n].filter(function (x) { return x; }); all = all.concat(G[n]); });
    ORDER.forEach(function (n) { G[n] = G[n].filter(function (x) { return all.some(function (y) { return y !== x && y.contains(x); }) === false; }); });
    var grid = q('.fq2-grid'), anchor = grid || G.Forecasts[0];
    var panel = document.createElement('div'); panel.className = 'fiqc-panel';
    var bar = document.createElement('nav'); bar.className = 'fiqc-bar'; bar.setAttribute('aria-label', 'FootballIQ sections');
    anchor.parentNode.insertBefore(bar, anchor); anchor.parentNode.insertBefore(panel, anchor);
    ORDER.forEach(function (n) { G[n].forEach(function (c) { panel.appendChild(c); }); });
    if (grid && grid.querySelector('section') == null) grid.style.display = 'none';
    var toolsList = secBy(/^tools/i);
    function pick(name, push) {
      ORDER.forEach(function (n) {
        G[n].forEach(function (c, i) {
          c.classList.remove('fiqc-main', 'fiqc-aside', 'fiqc-full');
          if (n === name) {
            c.classList.remove('fiqc-off');
            c.classList.add(G[n].length === 1 ? 'fiqc-full' : (i === 0 ? 'fiqc-main' : 'fiqc-aside'));
            if (c === toolsList && oldTools) return;
            [].forEach.call(c.querySelectorAll('details'), function (d) { if (d.closest('.fq2-fx') == null) d.open = true; });
            if (c.tagName === 'DETAILS') c.open = true;
          } else c.classList.add('fiqc-off');
        });
      });
      [].forEach.call(bar.children, function (a) { var on = a.getAttribute('data-t') === name; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      if (push) { try { history.pushState({ fiqc: name }, '', name === 'Forecasts' ? location.pathname : '?tab=' + name.toLowerCase()); } catch (e) {} }
    }
    ORDER.forEach(function (n) {
      if (G[n].length === 0) return;
      var a = document.createElement('a'); a.className = 'fiqc-tab'; a.setAttribute('data-t', n); a.textContent = n;
      a.href = n === 'Forecasts' ? location.pathname : '?tab=' + n.toLowerCase();
      a.addEventListener('click', function (e) { e.preventDefault(); pick(n, true); var y = bar.getBoundingClientRect().top + window.scrollY - 80; if (window.scrollY > y) window.scrollTo(0, y); });
      bar.appendChild(a);
    });
    function fromUrl() { var m = location.search.match(/[?&]tab=([a-z]+)/i), r = 'Forecasts'; if (m) ORDER.forEach(function (n) { if (n.toLowerCase() === m[1].toLowerCase() && G[n].length) r = n; }); return r; }
    window.addEventListener('popstate', function () { pick(fromUrl(), false); });
    pick(fromUrl(), false);
    done();
    return true;
  }
  if (build() === false) { var t = 0, iv = setInterval(function () { t++; if (build() || t > 20) { clearInterval(iv); done(); } }, 150); }
})();

/* FIQX3: Explore cards open their view inside Explore */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var host=null, tiles=null;
  function btn(v){ return v ? document.querySelector("#seg .seg-btn[data-v='"+v+"']") : null; }
  function vOf(a){
    var h=a.getAttribute('href')||'';
    if(h.indexOf('/tournaments/ucl')==0) return (tiles && tiles.contains(a)) ? 'ucl' : null;
    var m=h.match(/[?&]v=([a-z]+)/); return m ? m[1] : null;
  }
  function css(){
    var s=document.createElement('style');
    s.textContent='#seg{display:none'+IMP+'}#fiqx-host #view-wc{display:none'+IMP+'}'+
      '#fiqx-host{margin-top:14px}#fiqx-host [id^="view-"]{max-width:none'+IMP+';margin-left:0'+IMP+';margin-right:0'+IMP+'}'+
      'a.fiqx-on{border-color:#22d3ee'+IMP+';box-shadow:inset 0 0 0 1px #22d3ee}';
    document.head.appendChild(s);
  }
  function setup(){
    var seg=document.getElementById('seg'), card=document.querySelector('a.fq2-season');
    if(seg==null || card==null) return false;
    tiles=card.parentNode;
    var old=seg.parentNode;
    host=document.createElement('div'); host.id='fiqx-host';
    tiles.parentNode.insertBefore(host, tiles.nextSibling);
    host.appendChild(seg);
    Array.prototype.slice.call(old.children).forEach(function(e){
      if((e.id||'').indexOf('view-')==0) host.appendChild(e);
    });
    if(old.textContent.replace(/\s+/g,'')=='') old.style.display='none';
    css();
    return true;
  }
  function showExplore(){
    var d=tiles.closest('details'); if(d) d.open=true;
    if(host.offsetParent==null){
      var t=document.querySelector('a[href$="tab=explore"]'); if(t) t.click();
    }
  }
  function mark(v){
    Array.prototype.slice.call(tiles.querySelectorAll('a')).forEach(function(a){
      if(vOf(a)==v) a.classList.add('fiqx-on'); else a.classList.remove('fiqx-on');
    });
  }
  function open(v, push){
    var b=btn(v); if(b==null) return false;
    showExplore();
    b.click();
    setTimeout(function(){
      Array.prototype.slice.call(host.children).forEach(function(e){
        if((e.id||'').indexOf('view-')==0) e.style.display = (e.id=='view-'+v) ? '' : 'none';
      });
    },60);
    mark(v);
    var url='/footballiq/?tab=explore&v='+v;
    if(push) history.pushState({fiqx:v},'',url); else history.replaceState({fiqx:v},'',url);
    var r=host.getBoundingClientRect();
    if(push && (r.top<0 || r.top>window.innerHeight*0.6)) tiles.scrollIntoView({block:'start',behavior:'smooth'});
    return true;
  }
  document.addEventListener('click', function(e){
    if(host==null || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var a=e.target.closest ? e.target.closest('a') : null; if(a==null) return;
    var v=vOf(a);
    if(btn(v)==null) return;
    e.preventDefault();
    open(v, true);
  }, true);
  window.addEventListener('popstate', function(){
    var m=location.search.match(/[?&]v=([a-z]+)/);
    if(m && host) setTimeout(function(){ open(m[1], false); },0);
  });
  var n=0;
  (function wait(){
    n++;
    var ready=document.documentElement.classList.contains('fiqc-ready') || n>20;
    if(ready && setup()){
      var m=location.search.match(/[?&]v=([a-z]+)/);
      if(m) open(m[1], false);
      return;
    }
    if(n<70) setTimeout(wait,150);
  })();
})();

/* FIQX3b: remove the duplicate "Explore the data" block outside the tabs */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  function sweep(){
    var hs=document.querySelectorAll('summary,h2,h3,h4,.sech,.fq2-h,b,strong');
    for(var i=0;i<hs.length;i++){
      var t=(hs[i].textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(t.indexOf('explore the data')==0){
        var box=hs[i].closest('details,section,aside,nav') || hs[i].parentNode;
        if(box.closest('.fiqc-panel') || box.closest('#fiqx-host')) continue;
        box.style.setProperty('display','none','important');
        box.setAttribute('data-fiqx-hidden','1');
      }
    }
  }
  sweep();
  document.addEventListener('DOMContentLoaded', sweep);
  window.addEventListener('load', sweep);
  var k=0, iv=setInterval(function(){ sweep(); k++; if(k>20) clearInterval(iv); },500);
  if(window.MutationObserver){
    var busy=false;
    new MutationObserver(function(){
      if(busy) return; busy=true;
      setTimeout(function(){ sweep(); busy=false; },120);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
})();

/* FIQX3c: desktop shows the top 4 forecasts in This week */
(function(){
  var WANT=4;
  function wide(){ return window.matchMedia('(min-width: 1100px)').matches; }
  function findSection(){
    var hs=document.querySelectorAll('h2,h3');
    for(var i=0;i<hs.length;i++){
      var t=(hs[i].textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(t.indexOf('this week')==0) return hs[i].closest('section') || hs[i].parentNode;
    }
    return null;
  }
  function cardsIn(sec){
    var links=sec.querySelectorAll('a,button');
    var el=null;
    for(var i=0;i<links.length;i++){
      if(/make your call/i.test(links[i].textContent||'')){ el=links[i]; break; }
    }
    if(el==null) return null;
    while(el.parentNode && el.parentNode !== sec){
      var p=el.parentNode, cls=el.className, tag=el.tagName;
      var same=Array.prototype.filter.call(p.children,function(c){ return c.tagName==tag && c.className==cls; });
      if(same.length>=2) return same;
      el=p;
    }
    return null;
  }
  function run(){
    var sec=findSection(); if(sec==null) return;
    var cards=cardsIn(sec); if(cards==null) return;
    var forced=sec.querySelectorAll('[data-fiqx-top]');
    if(wide()==false){
      Array.prototype.forEach.call(forced,function(c){ c.style.removeProperty('display'); c.removeAttribute('data-fiqx-top'); });
      return;
    }
    var shown=0, disp='';
    cards.forEach(function(c){
      var d=getComputedStyle(c).display;
      if(d=='none'){ if(c.hasAttribute('data-fiqx-top')) shown++; }
      else { shown++; if(disp=='') disp=d; }
    });
    if(disp=='') disp='block';
    for(var i=0;i<cards.length && shown<WANT;i++){
      var c=cards[i];
      if(getComputedStyle(c).display=='none'){
        c.style.setProperty('display',disp,'important');
        c.setAttribute('data-fiqx-top','1');
        shown++;
      }
    }
  }
  var t=null;
  function soon(){ clearTimeout(t); t=setTimeout(run,150); }
  run();
  window.addEventListener('load',soon);
  window.addEventListener('resize',soon);
  if(window.MutationObserver){
    new MutationObserver(soon).observe(document.documentElement,{childList:true,subtree:true});
  }
})();

/* FIQX3d: one link only, keep the All match previews button */
(function(){
  function sweep(){
    var els=document.querySelectorAll('p,div,small,span');
    for(var i=0;i<els.length;i++){
      var e=els[i];
      if(e.children.length>3) continue;
      var t=(e.textContent||'').replace(/\s+/g,' ').trim();
      if(/^\+\d+ more .*in the match previews\.?$/i.test(t)){
        e.style.setProperty('display','none','important');
      }
    }
  }
  var t=null;
  function soon(){ clearTimeout(t); t=setTimeout(sweep,150); }
  sweep();
  window.addEventListener('load',soon);
  if(window.MutationObserver){
    new MutationObserver(soon).observe(document.documentElement,{childList:true,subtree:true});
  }
})();

/* FIQ_PLAYERS_20261031: /footballiq/?tab=explore&v=players opens player search with the box ready */
(function(){
  if(location.pathname.indexOf('/footballiq/')<0 || /[?&]v=players/.test(location.search)==false) return;
  var n=0;
  (function go(){
    n++;
    var vp=document.getElementById('view-players');
    var ready=document.documentElement.classList.contains('fiqc-ready');
    if(vp==null || (ready==false && n<25)){ if(n<80) setTimeout(go,150); return; }
    var host=vp.parentElement;
    Array.prototype.slice.call(host.children).forEach(function(e){ if((e.id||'').indexOf('view-')==0) e.style.display=(e===vp)?'':'none'; });
    Array.prototype.slice.call(document.querySelectorAll('#seg .seg-btn')).forEach(function(b){ b.classList.remove('active'); });
    if(document.getElementById('pSearchInput')==null && typeof window.renderPlayers=='function') window.renderPlayers();
    var k=0;
    (function ready2(){
      k++;
      var i=document.getElementById('pSearchInput');
      if(i==null){ if(k<80) setTimeout(ready2,150); return; }
      var y=i.getBoundingClientRect().top+window.pageYOffset-90;
      window.scrollTo(0, y<0?0:y);
      try{ i.focus({preventScroll:true}); }catch(e){ i.focus(); }
    })();
  })();
})();
