/* 90minWaffle scroll-keeper v3 (SCROLLKEEP3_20261030)
   Puts you back exactly where you were when you come back to a page. Remembers the item at the top of the
   screen (not just a pixel offset) and holds it in place while the page finishes loading, correcting before
   each paint so nothing visibly jumps. Stops the moment you scroll yourself. */
(function () {
  'use strict';
  var store = null;
  try { store = window.sessionStorage; store.setItem('__nmw_t', '1'); store.removeItem('__nmw_t'); } catch (e) { store = null; }
  if (store === null) return;
  function fullKey() { return 'nmw-scroll:' + location.pathname + location.search; }
  function pathKey() { return 'nmw-scroll:' + location.pathname; }
  function read(k) { try { return JSON.parse(store.getItem(k) || 'null'); } catch (e) { return null; } }
  var saved = read(fullKey()) || read(pathKey());
  var restoring = false;
  var SEL = '[data-mid],.match-card,[data-abid],[id],.h5-card,.h5-story,article,section';
  function anchorAt() {
    try {
      var el = document.elementFromPoint(Math.round(window.innerWidth / 2), 96);
      while (el && el !== document.body && (el.matches && el.matches(SEL)) === false) el = el.parentElement;
      if (el == null || el === document.body) return null;
      var key = null, ab = el.classList.contains('match-card') ? el.querySelector('[data-abid]') : null;
      if (el.getAttribute('data-mid')) key = 'mid:' + el.getAttribute('data-mid');
      else if (ab) key = 'abc:' + ab.getAttribute('data-abid');
      else if (el.getAttribute('data-abid')) key = 'ab:' + el.getAttribute('data-abid');
      else if (el.id) key = 'id:' + el.id;
      else { var i = [].indexOf.call(document.querySelectorAll(SEL), el); if (i >= 0) key = 'ix:' + i; }
      return key ? { a: key, o: Math.round(el.getBoundingClientRect().top) } : null;
    } catch (e) { return null; }
  }
  function find(a) {
    try {
      var p = a.indexOf(':'), k = a.slice(0, p), v = a.slice(p + 1), q = function (s) { return document.querySelector(s); };
      if (k === 'mid') return q('[data-mid="' + CSS.escape(v) + '"]');
      if (k === 'abc') { var b = q('[data-abid="' + CSS.escape(v) + '"]'); return b ? b.closest('.match-card') : null; }
      if (k === 'ab') return q('[data-abid="' + CSS.escape(v) + '"]');
      if (k === 'id') return document.getElementById(v);
      if (k === 'ix') return document.querySelectorAll(SEL)[+v] || null;
    } catch (e) {}
    return null;
  }
  function save() {
    if (restoring) return;
    var o = { y: Math.round(window.scrollY || window.pageYOffset || 0), t: Date.now() }, an = o.y > 0 ? anchorAt() : null;
    if (an) { o.a = an.a; o.o = an.o; }
    try { var v = JSON.stringify(o); store.setItem(fullKey(), v); store.setItem(pathKey(), v); } catch (e) {}
  }
  var tmr = null;
  window.addEventListener('scroll', function () { if (tmr) return; tmr = setTimeout(function () { tmr = null; save(); }, 250); }, { passive: true });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') save(); });
  document.addEventListener('click', save, true);
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  if (saved == null || (saved.y > 0) === false) return;
  function navType() {
    try { var n = performance.getEntriesByType('navigation'); if (n && n[0] && n[0].type) return n[0].type; } catch (e) {}
    try { if (performance.navigation && performance.navigation.type === 2) return 'back_forward'; } catch (e) {}
    return 'navigate';
  }
  function cameFromChild() {
    try {
      if (document.referrer === '') return false;
      var r = new URL(document.referrer); if (r.origin === location.origin) {} else return false;
      var here = location.pathname.replace(/\/?$/, '/');
      return r.pathname === location.pathname ? false : r.pathname.indexOf(here) === 0;
    } catch (e) { return false; }
  }
  var fresh = (Date.now() - (saved.t || 0)) < 30 * 60 * 1000;
  if ((navType() === 'back_forward' || (fresh && cameFromChild())) === false) return;
  var cancelled = false, start = Date.now(), lastChange = Date.now(), ro = null;
  restoring = true;
  function want() {
    if (saved.a) { var el = find(saved.a); if (el) return Math.max(0, el.getBoundingClientRect().top + (window.scrollY || 0) - (saved.o || 0)); }
    return saved.y;
  }
  function apply() {
    var y = want(); if (Math.abs((window.scrollY || 0) - y) > 2) window.scrollTo(0, y);
    try { if (window._scrollPos && typeof window.activeTab === 'string') window._scrollPos[window.activeTab] = y; } catch (e) {}
  }
  function finish() { if (restoring === false) return; restoring = false; if (ro) ro.disconnect(); save(); }
  function cancel() { cancelled = true; finish(); }
  ['touchmove', 'wheel', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { if (Date.now() - start > 300) cancel(); }, { passive: true }); });
  try { ro = new ResizeObserver(function () { if (cancelled || restoring === false) return; lastChange = Date.now(); apply(); }); ro.observe(document.documentElement); if (document.body) ro.observe(document.body); } catch (e) { ro = null; }
  function tick() {
    if (cancelled || restoring === false) return;
    apply();
    if (Date.now() - lastChange > 1200 || Date.now() - start > 8000) { finish(); return; }
    requestAnimationFrame(tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick); else tick();
})();
