(function () { /* LIVETOP5_20261031c: PHONES ONLY - top 5 live games (page order = top leagues first), rest behind a drop-down. Desktop shows all. No DOM tug-of-war. */
  var CAP = 5, open = false, busy = false, mq = window.matchMedia('(max-width: 768px)'), imp = ' ' + String.fromCharCode(33) + 'important';
  var st = document.createElement('style');
  st.textContent = '.lt5-x{display:none' + imp + '}html.lt5-on .lc-more{display:none' + imp + '}html.lt5-on .mc-item.lc-x:not(.lt5-x){display:revert' + imp + '}' +
    '.lt5-btn{display:block;width:100%;min-height:46px;margin:10px 0;border:1px solid rgba(34,211,238,.35);border-radius:12px;background:rgba(34,211,238,.07);color:#22d3ee;font-weight:700;font-size:15px;cursor:pointer}';
  document.head.appendChild(st);
  document.documentElement.classList.add('lt5-on');
  function isLive(x) { return /\bLIVE\b/i.test(x.textContent || ''); }
  function apply() {
    if (busy) return; busy = true;
    var groups = [];
    [].slice.call(document.querySelectorAll('.mc-item')).filter(isLive).forEach(function (c) {
      var g = groups.filter(function (x) { return x.p === c.parentElement; })[0];
      if (g == null) { g = { p: c.parentElement, items: [] }; groups.push(g); }
      g.items.push(c);
    });
    groups.forEach(function (g) {
      var btn = g.p.querySelector(':scope > .lt5-btn');
      var cap = mq.matches ? CAP : 6; /* LIVETOP_DESK6_20261108: desktop shows the top 6, then See more live */ if (g.items.length <= cap) { g.items.forEach(function (x) { x.classList.remove('lt5-x'); }); if (btn) btn.remove(); return; }
      g.items.forEach(function (x, j) { var h = (open == false && j >= cap); if (x.classList.contains('lt5-x') === h) {} else x.classList.toggle('lt5-x', h); });
      if (btn == null) {
        btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lt5-btn';
        btn.addEventListener('click', function (e) { e.preventDefault(); open = (open == false); apply(); if (open == false) g.p.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
      }
      var txt = open ? 'Show fewer live games \u25B4' : (mq.matches ? 'Show all ' + g.items.length + ' live games \u25BE' : 'See more live (' + (g.items.length - cap) + ') \u25BE');
      if (btn.textContent === txt) {} else btn.textContent = txt;
      var last = g.items[g.items.length - 1], n = last.nextElementSibling, ok = false;
      for (var k = 0; k < 3 && n; k++) { if (n === btn) { ok = true; break; } if (n.classList.contains('lc-more') || n.classList.contains('lc-x')) { n = n.nextElementSibling; } else break; }
      if (ok == false) last.parentNode.insertBefore(btn, last.nextSibling);
    });
    busy = false;
  }
  var t = 0;
  new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; apply(); }, 250); }).observe(document.body, { childList: true, subtree: true });
  if (mq.addEventListener) mq.addEventListener('change', apply);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
  setTimeout(apply, 1500); setTimeout(apply, 3500);
})();
