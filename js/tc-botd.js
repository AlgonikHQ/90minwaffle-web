(function () { /* HOMEBOTD_20261120: tap the homepage Bet of the Day card and the full tip opens in a pop-up sheet (the tips page's own card, shown via /edges/?embed=1). */
  var css = '.tcb-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;opacity:0;transition:opacity .2s}.tcb-ov.on{opacity:1}' +
    '.tcb-sh{position:fixed;left:0;right:0;bottom:0;height:88vh;max-width:720px;margin:0 auto;z-index:9999;border-radius:18px 18px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.4);' +
    'transform:translateY(100%);transition:transform .25s ease;display:flex;flex-direction:column;overflow:hidden}.tcb-sh.on{transform:none}' +
    '.tcb-top{display:flex;align-items:center;justify-content:center;position:relative;min-height:44px;flex:0 0 auto}.tcb-hd{width:44px;height:5px;border-radius:3px;background:rgba(127,127,127,.5)}' +
    '.tcb-x{position:absolute;right:8px;top:2px;width:44px;height:44px;border:0;background:transparent;color:inherit;font-size:26px;line-height:1;cursor:pointer}' +
    '.tcb-fr{flex:1 1 auto;width:100%;border:0;background:transparent}.tcb-ld{position:absolute;top:45%;left:0;right:0;text-align:center;opacity:.7;font-size:14px}' +
    '.tcb-more{flex:0 0 auto;display:block;text-align:center;padding:14px;font-weight:700;text-decoration:none;color:var(--accent,#C9A24B);border-top:1px solid rgba(127,127,127,.2)}';
  var ov, sh, last;
  function addCss() { if (document.getElementById('tcb-css')) return; var s = document.createElement('style'); s.id = 'tcb-css'; s.textContent = css; document.head.appendChild(s); }
  function close() {
    if (!sh) return;
    var a = sh, b = ov; sh = ov = null;
    a.classList.remove('on'); b.classList.remove('on'); document.documentElement.style.overflow = '';
    setTimeout(function () { a.remove(); b.remove(); }, 260);
    if (last && last.focus) last.focus();
  }
  function open(el) {
    if (sh) return;
    addCss(); last = el;
    var slug = String(el.getAttribute('data-tc-botd') || '').replace(/[^a-z0-9-]/g, '');
    var bg = getComputedStyle(document.body).backgroundColor; if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') bg = '#111';
    ov = document.createElement('div'); ov.className = 'tcb-ov'; ov.addEventListener('click', close);
    sh = document.createElement('div'); sh.className = 'tcb-sh'; sh.style.background = bg;
    sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', 'Bet of the Day');
    sh.innerHTML = '<div class="tcb-top"><span class="tcb-hd"></span><button type="button" class="tcb-x" aria-label="Close">\u00d7</button></div>' +
      '<div class="tcb-ld">Loading the tip\u2026</div><iframe class="tcb-fr" title="Bet of the Day" src="/edges/?embed=1#edge-' + slug + '"></iframe>' +
      '<a class="tcb-more" href="/edges/#edge-' + slug + '">All of today\u2019s tips \u2192</a>';
    document.body.appendChild(ov); document.body.appendChild(sh); document.documentElement.style.overflow = 'hidden';
    sh.querySelector('.tcb-x').addEventListener('click', close);
    sh.querySelector('iframe').addEventListener('load', function () { var l = sh && sh.querySelector('.tcb-ld'); if (l) l.remove(); });
    var top = sh.querySelector('.tcb-top'), y0 = null;
    top.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, {passive: true});
    top.addEventListener('touchend', function (e) { if (y0 !== null && e.changedTouches[0].clientY - y0 > 60) close(); y0 = null; });
    requestAnimationFrame(function () { if (!sh) return; ov.classList.add('on'); sh.classList.add('on'); sh.querySelector('.tcb-x').focus(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.tcBotd = open;
})();
