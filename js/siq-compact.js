/* SIQC_20261031: StatIQ - record-detail tabs, How it works closed by default, compact tip rows, tap a tip for a slide-up sheet with the full card (moved, not copied). */
(function () {
  if (window.__siqc) return; window.__siqc = 1;
  var I = ' ' + String.fromCharCode(33) + 'important';
  var st = document.createElement('style'); st.id = 'siqc-css';
  st.textContent = [
    '.siqc-h{font-size:19px;font-weight:800;margin:6px 0 8px}',
    '.siqc-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 0 10px}',
    '.siqc-tab{flex:0 0 auto;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid #1e3157;background:none;color:#c5d2e8;font:inherit;font-size:13px;cursor:pointer}',
    '.siqc-tab.on{background:#22d3ee;border-color:#22d3ee;color:#04222a;font-weight:700}',
    '.siqc-off{display:none' + I + '}', '.siqc-sec details.sq2-acc>summary{display:none' + I + '}',
    'article.tip.siqc{cursor:pointer}',
    'article.tip.siqc>*:not(.tip-header):not(.botd-ribbon):not(.builder-ribbon){display:none' + I + '}',
    'article.tip.siqc .tip-expand-hint{display:none' + I + '}',
    '#siqc-bg{position:fixed;inset:0;background:rgba(3,8,20,.62);z-index:9990;opacity:0;transition:opacity .2s}', '#siqc-bg.on{opacity:1}',
    '#siqc-sh{position:fixed;left:0;right:0;bottom:0;max-height:88vh;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#0d1a33;border-top:1px solid #2b4573;border-radius:22px 22px 0 0;z-index:9991;transform:translateY(100%);transition:transform .25s ease;padding:8px 14px calc(22px + env(safe-area-inset-bottom))}',
    '#siqc-sh.on{transform:none}', '@media(min-width:900px){#siqc-sh{left:50%;right:auto;width:620px;margin-left:-310px}}',
    '.siqc-hdl{width:44px;height:5px;border-radius:3px;background:#3a4a6a;margin:4px auto 10px}',
    '.siqc-x{position:absolute;top:8px;right:10px;width:44px;height:44px;border:0;background:none;color:#c5d2e8;font-size:20px;cursor:pointer}',
    '#siqc-sh article.tip{margin:0;cursor:default}'
  ].join('');
  document.head.appendChild(st);
  function txt(e) { return ((e && e.textContent) || '').replace(/\s+/g, ' ').trim(); }
  function head() {
    var ph = document.querySelector('.page-header'); if (ph == null || ph.getAttribute('data-siqc')) return;
    ph.setAttribute('data-siqc', '1');
    var w = document.createTreeWalker(ph, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) if (/\bbeta\s*·\s*/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\bbeta\s*·\s*/i, '');
  }
  function tabs() {
    var all = [].slice.call(document.querySelectorAll('section.sq2-sec'));
    var how = all.filter(function (s) { return s.querySelector('#sq2-how'); })[0];
    if (how && how.getAttribute('data-siqc') === null) { how.setAttribute('data-siqc', '1'); var hd = how.querySelector('details.sq2-acc'); if (hd) hd.open = false; }
    var map = [[/month/i, 'Months'], [/bad run/i, 'Bad runs'], [/market/i, 'Markets'], [/profit/i, 'Profit']], secs = [];
    map.forEach(function (m) {
      var s = all.filter(function (x) { var d = x.querySelector('details.sq2-acc'); return d && x.querySelector('#sq2-how') == null && m[0].test(txt(d.querySelector('h2') || d)); })[0];
      if (s) secs.push([m[1], s]);
    });
    if (secs.length < 2 || secs[0][1].getAttribute('data-siqc')) return;
    var bar = document.createElement('div'); bar.className = 'siqc-tabs'; bar.setAttribute('role', 'tablist');
    var h = document.createElement('h2'); h.className = 'siqc-h'; h.textContent = 'The record, in detail';
    secs[0][1].parentNode.insertBefore(h, secs[0][1]); secs[0][1].parentNode.insertBefore(bar, secs[0][1]);
    function pick(i) {
      secs.forEach(function (p, j) { var d = p[1].querySelector('details.sq2-acc'); if (j === i) { p[1].classList.remove('siqc-off'); if (d) d.open = true; } else p[1].classList.add('siqc-off'); });
      [].forEach.call(bar.children, function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    }
    secs.forEach(function (p, i) {
      p[1].setAttribute('data-siqc', '1'); p[1].classList.add('siqc-sec');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'siqc-tab'; b.setAttribute('role', 'tab'); b.textContent = p[0];
      b.addEventListener('click', function () { pick(i); }); bar.appendChild(b);
    });
    pick(0);
  }
  function tips() { [].forEach.call(document.querySelectorAll('article.tip'), function (a) { if (a.closest('#siqc-sh') == null && a.getAttribute('data-siqc') === null) { a.setAttribute('data-siqc', '1'); a.classList.add('siqc'); } }); }
  var bg = null, sh = null, cur = null;
  function mk() {
    bg = document.createElement('div'); bg.id = 'siqc-bg';
    sh = document.createElement('div'); sh.id = 'siqc-sh'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', 'Tip details');
    sh.innerHTML = '<div class="siqc-hdl"></div><button type="button" class="siqc-x" aria-label="Close">✕</button><div class="siqc-body"></div>';
    document.body.appendChild(bg); document.body.appendChild(sh);
    bg.addEventListener('click', close); sh.querySelector('.siqc-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) close(); });
    var y0 = null;
    sh.addEventListener('touchstart', function (e) { y0 = sh.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    sh.addEventListener('touchend', function (e) { if (y0 != null && e.changedTouches[0].clientY - y0 > 90) close(); y0 = null; }, { passive: true });
  }
  function open(a) {
    if (sh == null) mk();
    cur = { a: a, p: a.parentNode, n: a.nextSibling };
    a.classList.remove('siqc'); a.classList.add('siqc-open');
    sh.querySelector('.siqc-body').appendChild(a);
    var hdr = a.querySelector('.tip-header'), more = [].filter.call(a.children, function (c) { return c !== hdr && /ribbon/.test(String(c.className || '')) === false; })[0];
    if (hdr && more && getComputedStyle(more).display === 'none' && typeof window.toggleTip === 'function') { try { window.toggleTip(hdr); } catch (e) {} }
    document.documentElement.style.overflow = 'hidden';
    bg.style.display = ''; sh.style.display = ''; sh.scrollTop = 0;
    requestAnimationFrame(function () { bg.classList.add('on'); sh.classList.add('on'); });
  }
  function close() {
    if (cur == null) return;
    var c = cur; cur = null; sh.classList.remove('on'); bg.classList.remove('on');
    setTimeout(function () {
      c.a.classList.remove('siqc-open'); c.a.classList.add('siqc');
      if (c.p && document.contains(c.p)) { if (c.n && c.n.parentNode === c.p) c.p.insertBefore(c.a, c.n); else c.p.appendChild(c.a); } else if (c.a.parentNode) c.a.parentNode.removeChild(c.a);
      bg.style.display = 'none'; sh.style.display = 'none'; document.documentElement.style.overflow = '';
    }, 260);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('article.tip.siqc') : null;
    if (a == null || e.target.closest('a,button,input,select,label')) return;
    e.preventDefault(); e.stopPropagation(); open(a);
  }, true);
  function pass() { head(); tabs(); tips(); }
  var tm = null;
  new MutationObserver(function () { if (tm) return; tm = setTimeout(function () { tm = null; pass(); }, 150); }).observe(document.body, { childList: true, subtree: true });
  pass(); setTimeout(pass, 800); setTimeout(pass, 2500);
})();
