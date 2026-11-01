/* MXC_20261030 v2: Matches - compact cards; tap opens a slide-up sheet holding the real Model / Team news / Form & H2H blocks (moved, not copied), put back on close. */
(function () {
  if (window.__mxc) return; window.__mxc = 1;
  var I = ' ' + String.fromCharCode(33) + 'important';
  var st = document.createElement('style'); st.id = 'mxc-css';
  st.textContent = [
    '.mxc-hold{display:none' + I + '}', '.match-card.mxc{cursor:pointer}',
    '.match-card.mxc .np{margin:6px 12px 4px' + I + ';padding:0' + I + ';border:0' + I + ';background:none' + I + ';box-shadow:none' + I + '}',
    '.match-card.mxc .np-h,.match-card.mxc .np p{display:none' + I + '}',
    '.match-card.mxc .np-r{font-size:12px' + I + ';margin-top:6px' + I + '}',
    '.mxc-sum{display:flex;align-items:center;gap:10px;padding:8px 12px 2px;font-size:12px;color:#9fb0cc}',
    '.mxc-mb{display:flex;height:6px;border-radius:3px;overflow:hidden;gap:2px;flex:1;max-width:130px}',
    '.mxc-mb i{display:block;height:100%}.mxc-h{background:#22d3ee}.mxc-d{background:#3a4a6a}.mxc-a{background:#c7d2e6}',
    '.mxc-nw{margin-left:auto;padding:3px 8px;border-radius:8px;background:#2a2410;color:#f5b942;font-weight:700;font-size:11.5px;white-space:nowrap}',
    '.mxc-hint{display:block;padding:4px 12px 10px;font-size:12px;color:#22d3ee;text-align:right}',
    '#mxc-bg{position:fixed;inset:0;background:rgba(3,8,20,.62);z-index:9990;opacity:0;transition:opacity .2s}', '#mxc-bg.on{opacity:1}',
    '#mxc-sh{position:fixed;left:0;right:0;bottom:0;max-height:88vh;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#0d1a33;border-top:1px solid #2b4573;border-radius:22px 22px 0 0;z-index:9991;transform:translateY(100%);transition:transform .25s ease;padding:8px 0 calc(22px + env(safe-area-inset-bottom))}',
    '#mxc-sh.on{transform:none}', '@media(min-width:900px){#mxc-sh{left:50%;right:auto;width:560px;margin-left:-280px}}',
    '.mxc-hdl{width:44px;height:5px;border-radius:3px;background:#3a4a6a;margin:4px auto 10px}',
    '.mxc-x{position:absolute;top:8px;right:10px;width:44px;height:44px;border:0;background:none;color:#c5d2e8;font-size:20px;cursor:pointer}',
    '.mxc-head{padding:0 14px}', '.mxc-head .match-card{margin:0;cursor:default}',
    '.mxc-tabs{display:flex;gap:6px;padding:12px 14px 6px;overflow-x:auto;scrollbar-width:none}',
    '.mxc-tab{flex:0 0 auto;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid #1e3157;background:none;color:#c5d2e8;font:inherit;font-size:13px;cursor:pointer}',
    '.mxc-tab.on{background:#22d3ee;border-color:#22d3ee;color:#04222a;font-weight:700}',
    '.mxc-body{padding:6px 14px 0}', '.mxc-acts{padding:12px 14px 0}',
    '.mxc-full{display:block;padding:14px 14px 4px;text-align:center;font-size:13px;color:#22d3ee;text-decoration:none}'
  ].join('');
  document.head.appendChild(st);
  function txt(e) { return ((e && e.textContent) || '').replace(/\s+/g, ' ').trim(); }
  function top(node, root) { var n = node; while (n && n.parentNode && n.parentNode !== root) n = n.parentNode; return n && n.parentNode === root ? n : null; }
  function prep(card) {
    if (card.getAttribute('data-mxc')) return;
    card.setAttribute('data-mxc', '1'); card.classList.add('mxc');
    var hold = document.createElement('div'); hold.className = 'mxc-hold';
    [].slice.call(card.children).forEach(function (c) {
      var cls = String(c.className || ''), t = txt(c);
      if (/match-stripe|match-top|match-body/.test(cls)) return;
      if (/edge|featured|form|stat|h2h/i.test(cls) || /\bForm\b|\bH2H\b/.test(t)) { if (/\bForm\b|\bH2H\b/.test(t)) card.__form = c; return; }
      if (c.classList.contains('np') || (c.querySelector && c.querySelector('.np'))) return;
      hold.appendChild(c);
    });
    var sum = document.createElement('div'); sum.className = 'mxc-sum';
    var hint = document.createElement('span'); hint.className = 'mxc-hint'; hint.textContent = 'Model, team news & H2H ›';
    card.appendChild(sum); card.appendChild(hint); card.appendChild(hold);
    card.__sum = sum; card.__hint = hint; card.__hold = hold;
  }
  function grab(card) {
    [].slice.call(card.children).forEach(function (c) { if (c.matches && c.matches('a.details-btn')) { if (card.__panel == null) card.__panel = c; card.__hold.appendChild(c); } });  /* MOBILE_PANEL: m-scores.js moves the panel inside the card on phones */
    var n = card.nextElementSibling, k = 0;
    while (n && k < 6 && n.classList.contains('match-card') === false) {
      var nx = n.nextElementSibling;
      if (n.matches('a.details-btn')) { if (card.__panel == null) card.__panel = n; card.__hold.appendChild(n); }
      else if (n.classList.contains('np') || n.querySelector('.np')) card.insertBefore(n, card.__sum);
      else if (txt(n) === '' && n.querySelector('img,svg,canvas') == null) card.__hold.appendChild(n);
      else break;
      n = nx; k++;
    }
    if (card.__hold) [].forEach.call(card.__hold.querySelectorAll('.np'), function (x) { card.insertBefore(x, card.__sum); });
  }
  function paint(card) {
    var p = card.__panel, s = card.__sum; if (s == null) return;
    var h = '';
    if (p) {
      var pr = p.querySelector('.mx-probs'), m = pr ? txt(pr).match(/(\d+)%/g) : null;
      if (m && m.length >= 3) {
        var a = m.slice(0, 3).map(function (x) { return parseInt(x, 10); });
        h += '<span class="mxc-mb"><i class="mxc-h" style="width:' + a[0] + '%"></i><i class="mxc-d" style="width:' + a[1] + '%"></i><i class="mxc-a" style="width:' + a[2] + '%"></i></span><span>' + a[0] + ' · ' + a[1] + ' · ' + a[2] + '</span>';
      }
      var t = txt(p), out = (t.match(/\bOUT\b/g) || []).length;
      (t.match(/\+(\d+) more/g) || []).forEach(function (x) { out += parseInt(x.replace(/\D/g, ''), 10) || 0; });
      if (out) h += '<span class="mxc-nw">' + out + ' out</span>';
    }
    if (s.__h === h) return; s.__h = h; s.innerHTML = h; s.style.display = h ? '' : 'none';
  }
  var bg = null, sh = null, cur = null, moved = [];
  function mk() {
    bg = document.createElement('div'); bg.id = 'mxc-bg';
    sh = document.createElement('div'); sh.id = 'mxc-sh'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', 'Match details');
    sh.innerHTML = '<div class="mxc-hdl"></div><button type="button" class="mxc-x" aria-label="Close">✕</button><div class="mxc-head"></div><div class="mxc-tabs" role="tablist"></div><div class="mxc-body"></div><div class="mxc-acts"></div><a class="mxc-full" href="#">Full match page ›</a>';
    document.body.appendChild(bg); document.body.appendChild(sh);
    bg.addEventListener('click', close); sh.querySelector('.mxc-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) close(); });
    var y0 = null;
    sh.addEventListener('touchstart', function (e) { y0 = sh.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    sh.addEventListener('touchend', function (e) { if (y0 != null && e.changedTouches[0].clientY - y0 > 90) close(); y0 = null; }, { passive: true });
  }
  function mv(node, dest) { if (node == null) return; moved.push([node, node.parentNode, node.nextSibling]); dest.appendChild(node); }
  function open(card) {
    if (sh == null) mk();
    cur = card; moved = [];
    var head = sh.querySelector('.mxc-head'), tabs = sh.querySelector('.mxc-tabs'), body = sh.querySelector('.mxc-body'), acts = sh.querySelector('.mxc-acts'), full = sh.querySelector('.mxc-full');
    head.innerHTML = ''; tabs.innerHTML = ''; body.innerHTML = ''; acts.innerHTML = ''; acts.className = 'mxc-acts card';  /* SAVEFIX: action bar needs a card with a link */
    var hc = document.createElement('div'); hc.className = 'match-card';
    [].forEach.call(card.children, function (c) { if (/match-top|match-body/.test(String(c.className || ''))) hc.appendChild(c.cloneNode(true)); });
    head.appendChild(hc);
    var p = card.__panel, panes = [];
    var paneM = document.createElement('div'), paneN = document.createElement('div'), paneF = document.createElement('div');
    full.style.display = 'none';
    if (p) {
      var news = null;
      [].some.call(p.querySelectorAll('*'), function (e) { if (/^team news/i.test(txt(e)) && e.children.length > 1) { news = e; return true; } return false; });
      var nb = news ? top(news, p) : null;
      var mb = p.querySelector('.mx-bar') || p.querySelector('.mx-probs'); mb = mb ? top(mb, p) : null;
      if (nb && nb === mb) nb = null;
      [].slice.call(p.childNodes).forEach(function (c) {
        if (c.nodeType === 1 && /^(Match details|Full-Time Stats)/i.test(txt(c))) return;
        if (c === nb) mv(c, paneN); else if (c.nodeType === 1) mv(c, paneM);
      });
      full.href = p.getAttribute('href') || '#'; full.style.display = '';
      full.textContent = /Full-Time/i.test(txt(p)) ? 'Full-time stats ›' : 'Full match page ›';
    }
    var src = document.createElement('a'); src.href = full.href; src.hidden = true; src.textContent = txt(card.querySelector('.match-body')); acts.appendChild(src);
    [].slice.call(card.__hold.children).forEach(function (c) {
      if (c === p) return;
      if (c.hasAttribute('data-abid')) mv(c, acts); else if (txt(c)) mv(c, paneM);
    });
    if (card.__form) paneF.appendChild(card.__form.cloneNode(true));
    if (paneM.children.length) panes.push(['Model', paneM]);
    if (paneN.children.length) panes.push(['Team news', paneN]);
    if (paneF.children.length) panes.push(['Form & H2H', paneF]);
    panes.forEach(function (pp, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mxc-tab' + (i === 0 ? ' on' : ''); b.setAttribute('role', 'tab'); b.textContent = pp[0];
      pp[1].className = 'mxc-pane'; pp[1].style.display = i === 0 ? '' : 'none';
      b.addEventListener('click', function () {
        [].forEach.call(tabs.children, function (x) { x.classList.remove('on'); }); b.classList.add('on');
        panes.forEach(function (q) { q[1].style.display = q[1] === pp[1] ? '' : 'none'; });
      });
      tabs.appendChild(b); body.appendChild(pp[1]);
    });
    tabs.style.display = panes.length > 1 ? '' : 'none';
    document.documentElement.style.overflow = 'hidden';
    bg.style.display = ''; sh.style.display = ''; sh.scrollTop = 0;
    requestAnimationFrame(function () { bg.classList.add('on'); sh.classList.add('on'); });
  }
  function close() {
    if (cur == null) return;
    var m = moved, c = cur; moved = []; cur = null;
    sh.classList.remove('on'); bg.classList.remove('on');
    setTimeout(function () {
      for (var i = m.length - 1; i >= 0; i--) {
        var n = m[i][0], par = m[i][1], nx = m[i][2];
        if (par) { if (nx && nx.parentNode === par) par.insertBefore(n, nx); else par.appendChild(n); }
      }
      bg.style.display = 'none'; sh.style.display = 'none'; document.documentElement.style.overflow = '';
      paint(c);
    }, 260);
  }
  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.match-card.mxc') : null;
    if (card == null) return;
    if (e.target.closest('a,button,input,select,label,.np,[data-abid],.team-home,.team-away')) return;
    e.preventDefault(); e.stopPropagation(); open(card);
  }, true);
  function pass() {
    [].forEach.call(document.querySelectorAll('.match-card'), function (c) {
      if (c === cur || (sh && sh.contains(c))) return;
      prep(c); grab(c); paint(c);
    });
  }
  var tm = null;
  new MutationObserver(function () { if (tm) return; tm = setTimeout(function () { tm = null; pass(); }, 150); }).observe(document.body, { childList: true, subtree: true });
  pass(); setTimeout(pass, 800); setTimeout(pass, 2500);
})();

/* MCSETTLE_20261031: mark the match cards settled once they stop changing for 350ms */
(function () {
  var t = null, root = document.documentElement;
  function settle(force) { if (force == null && document.querySelectorAll('.mc-item').length < 2) return; root.classList.add('mc-settled'); if (obs) obs.disconnect(); }  /* MCSETTLE2: real cards must have arrived */
  function poke() { if (t) clearTimeout(t); t = setTimeout(settle, 400); }
  var obs = null;
  function start() {
    if (document.getElementById('mc-comps') == null) { settle(); return; }
    obs = new MutationObserver(poke); obs.observe(document.body, { childList: true, subtree: true });
    poke(); setTimeout(function () { settle(true); }, 3000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


/* LIVESYNC_20261101: live cards take minute + score from the 1-minute feed every 30s (same 90+/45+ rules as Home) */
(function(){
  if(window.__liveSync) return; window.__liveSync=1;
  function nm(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,''); }
  function lab(m){
    var mn=parseInt(m.minute,10), st=String(m.status||'').toUpperCase();
    if(st==='HT') return 'HT';
    if(isNaN(mn) || mn<0 || mn>125) return '';
    if(/^(ET|1E|2E|BT)/.test(st)) return Math.min(mn,120)+"'";
    if(mn>90) return "90+'";
    if(st==='1H' && mn>45) return "45+'";
    return mn+"'";
  }
  function sync(){
    if(document.hidden) return;
    var cards=[].slice.call(document.querySelectorAll('.match-card')).filter(function(c){ return c.querySelector('.chip-live'); });
    if(cards.length===0) return;
    fetch('/data/live_now.json?t='+Math.floor(Date.now()/15000)).then(function(r){ return r.json(); }).then(function(d){
      var by={}, byName={};
      (d.matches||[]).forEach(function(m){ if(m.bsd_id!=null) by[String(m.bsd_id)]=m; byName[nm(m.home)+'|'+nm(m.away)]=m; });
      cards.forEach(function(c){
        var k=(String(c.getAttribute('onclick')).match(/bsd-(\d+)/)||[])[1], m=k ? by[k] : null;
        if(m==null){
          var h=c.querySelector('.team-home'), a=c.querySelector('.team-away');
          if(h && a) m=byName[nm(h.textContent.replace(/^\s*\S{1,3}\s/,''))+'|'+nm(a.textContent.replace(/^\s*\S{1,3}\s/,''))] || byName[nm(h.textContent)+'|'+nm(a.textContent)];
        }
        if(m==null || /^(FT|AET|PEN|NS)/.test(String(m.status||''))) return;
        var L=lab(m);
        var sc=c.querySelector('.score-live');
        if(sc && m.home_score!=null && m.away_score!=null) sc.textContent=m.home_score+'-'+m.away_score;
        var mi=c.querySelector('.score-min'); if(mi && L) mi.textContent=L;
        var ch=c.querySelector('.chip-live');
        if(ch && L){ var dot=ch.querySelector('.live-dot'); ch.textContent=(L==='HT' ? ' HT' : ' LIVE '+L); if(dot) ch.insertBefore(dot, ch.firstChild); }
        c.setAttribute('data-ls', m.bsd_id==null ? 'name' : String(m.bsd_id));
      });
    }).catch(function(){});
  }
  function boot(){ setTimeout(sync,2500); setInterval(sync,30000); document.addEventListener('visibilitychange', function(){ if(document.hidden==false) sync(); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
