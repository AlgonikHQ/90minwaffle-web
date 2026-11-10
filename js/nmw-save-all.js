/* NMW_SAVEALL_20261110: Like / dislike / save / share bar on every story, news item, preview and club page. Each bar carries its own deep link. */
(function () {
  'use strict';
  if (window.__nmwSaveAll) return; window.__nmwSaveAll = true;
  var W = window, D = document;
  function hid(u) { var h = 5381; for (var i = 0; i < u.length; i++) h = ((h << 5) + h + u.charCodeAt(i)) >>> 0; return 'st_' + h.toString(36); }
  function ready(cb, n) {
    if (W.actionBar) return cb(); n = n || 0;
    if (n === 4 && !D.querySelector('script[src*="action-bar.js"]')) { var s = D.createElement('script'); s.src = '/js/action-bar.js?v=20261024m'; D.head.appendChild(s); }
    if (n < 50) setTimeout(function () { ready(cb, n + 1); }, 150);
  }
  var MAP = {}, mapReady = false;
  function loadMap(cb) {
    var done = function () { if (!mapReady) { mapReady = true; cb(); } };
    setTimeout(done, 2500);
    fetch('/data/content.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
      (Array.isArray(d) ? d : (d.items || [])).forEach(function (it) { try { if (it && it.url && it.id != null) MAP[new URL(it.url).href] = it; } catch (e) {} });
    }).catch(function () {}).then(done);
  }
  function deep(u, t) {
    var it = MAP[u], q = [];
    if (it) q.push('story=' + encodeURIComponent(it.id));
    q.push('u=' + encodeURIComponent(u)); q.push('t=' + encodeURIComponent((t || (it && it.title) || '').slice(0, 160)));
    if (it && it.source) q.push('s=' + encodeURIComponent(String(it.source).slice(0, 60)));
    return location.origin + '/news/for-you/?' + q.join('&');
  }
  function migrate() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i); if (!k || k.indexOf('nmw_fav_') !== 0) continue;
        var v; try { v = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
        if (!v || !v.url) continue;
        var u; try { u = new URL(v.url, location.href); } catch (e) { continue; }
        if (u.origin === location.origin || !/^https?:$/.test(u.protocol)) continue;
        v.url = deep(u.href, v.title || '');
        localStorage.setItem(k, JSON.stringify(v));
        [].forEach.call(D.querySelectorAll('a.nmwa-sa[data-fid="' + String(v.id || k.slice(8)).replace(/"/g, '') + '"]'), function (a) { a.href = v.url; });
      }
    } catch (e) {}
  }
  function mk(url, label, type, dl, ph) {
    var id = hid(url), b = ph || D.createElement('div');
    b.className = 'nmwa-compact nmw-sa'; b.setAttribute('data-abid', id); b.setAttribute('data-nmw-url', dl || url);
    b.innerHTML = W.actionBar(id, label, type); return b;
  }
  function stories(ids) {
    [].forEach.call(D.querySelectorAll('.h5-story'), function (el) {
      if (el.getAttribute('data-nmw-sa') || el.querySelector('[data-abid]')) return;
      var as = [].slice.call(el.querySelectorAll('a[href]')), a = null, i;
      for (i = 0; i < as.length; i++) if (as[i].textContent.trim().length > 12 && !/\/(clubs|league|nations)\//.test(as[i].getAttribute('href'))) { a = as[i]; break; }
      if (!a) a = as[0]; if (!a || !a.href) return;
      var img = el.querySelector('img[alt]'), label = a.textContent.trim() || (img && img.alt) || '';
      el.setAttribute('data-nmw-sa', '1'); var ph = el.querySelector(':scope > .nmw-ph'), b = mk(a.href, label, 'story', deep(a.href, label), ph); if (!ph) el.appendChild(b); ids.push(b.getAttribute('data-abid'));
    });
  }
  function news(ids) {
    var main = D.querySelector('.nw-wrap'); if (!main) return;
    [].forEach.call(main.querySelectorAll('.nw-t'), function (t) {
      var p = t; while (p.parentNode && p.parentNode !== main && p.parentNode.querySelectorAll('.nw-t').length === 1) p = p.parentNode;
      if (p.getAttribute('data-nmw-sa')) return;
      var anc = p.closest('a'), a = anc || p.querySelector('a[href]') || t.closest('a');
      if (!a || !a.href) return;
      p.setAttribute('data-nmw-sa', '1'); var ph = p.querySelector(':scope > .nmw-ph'), b = mk(a.href, t.textContent.trim(), 'story', deep(a.href, t.textContent.trim()), ph);
      if (ph) { } else if (anc) anc.parentNode.insertBefore(b, anc.nextSibling); else p.appendChild(b);
      ids.push(b.getAttribute('data-abid'));
    });
  }
  function page(ids) {
    var m = location.pathname.match(/^\/(preview)\/[^/]+/); if (!m) return;
    if (D.querySelector('.nmwa, [data-abid]')) return;
    var h = D.querySelector('main h1') || D.querySelector('h1'); if (!h) return;
    var vs = D.querySelector('.vs'), after = (vs && vs.parentNode === h.parentNode) ? vs : h;
    var ph = D.querySelector('.nmw-ph-page'), b = mk(location.origin + location.pathname, h.textContent.trim(), 'preview', undefined, ph);
    if (!ph) after.parentNode.insertBefore(b, after.nextSibling); ids.push(b.getAttribute('data-abid'));
  }
  function run() {
    if (!mapReady) return; var ids = []; try { stories(ids); news(ids); page(ids); } catch (e) {}
    if (!ids.length) return;
    fetch('/api/react/bulk?ids=' + encodeURIComponent(ids.join(',')), { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
      W.REACT_COUNTS = W.REACT_COUNTS || {};
      ids.forEach(function (i) { if (d && d[i]) { W.REACT_COUNTS[i] = d[i]; [].forEach.call(D.querySelectorAll('[data-abid="' + i + '"]'), function (el) { el.innerHTML = W.actionBar(i); }); } });
    }).catch(function () {});
  }
  var st = D.createElement('style'); st.textContent = '.nmw-sa.nmwa-compact{flex:0 0 100%!important;grid-column:1/-1;width:100%!important;max-width:100%!important;order:99;display:block!important;margin:8px 0 0!important;padding:0!important;border:0!important;background:none!important}.nmw-sa .action-bar{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center;justify-content:flex-start!important;gap:8px!important;border:0!important;background:none!important;padding:0!important;margin:0!important}.nmw-sa .action-btn{flex:0 0 auto!important;width:auto!important;min-width:0!important;display:inline-flex!important;align-items:center;gap:5px;padding:5px 11px!important;min-height:32px;border-radius:999px!important;border:1px solid rgba(148,163,184,.25)!important;background:transparent!important;color:var(--text-dim,#94a3b8)!important;font-size:.72rem!important;font-weight:600;box-shadow:none!important}.nmw-sa .action-btn.liked,.nmw-sa .action-btn.faved,.nmw-sa .action-btn.disliked{color:#22d3ee!important;border-color:#22d3ee!important}.nmw-sa .action-btn svg{width:15px!important;height:15px!important}[data-nmw-sa]{flex-wrap:wrap!important}'; (D.head || D.documentElement).appendChild(st);
  D.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-nmwa]'); if (!b) return;
    var act = b.getAttribute('data-nmwa'); if (act !== 'like' && act !== 'dislike' && act !== 'save') return;
    var id = b.getAttribute('data-id') || '', box = D.querySelector('[data-abid="' + id.replace(/"/g, '') + '"]'), url = box && box.getAttribute('data-nmw-url'); if (!url) return;
    try { var k = 'nmw_meta_' + id; if (!localStorage.getItem(k)) { var r = (W.__nmwReg || {})[id] || {}; localStorage.setItem(k, JSON.stringify({ id: id, url: url, title: r.label || '', type: r.type || '', t: Date.now() })); } } catch (er) {}
  }, true);
  var tm; function later() { clearTimeout(tm); tm = setTimeout(run, 400); }
  function start() { loadMap(function () { migrate(); run(); setTimeout(run, 1500); }); try { new MutationObserver(later).observe(D.body, { childList: true, subtree: true }); } catch (e) {} }
  function go() { ready(start); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})();
