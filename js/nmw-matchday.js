/* NMW_MATCHDAY_20261110: matchday card for the followed club - before kick-off, live, full time. Home and Me only. */
(function () {
  'use strict';
  if (window.__nmwMatchday) return; window.__nmwMatchday = true;
  var P = location.pathname, ON_HOME = (P === '/' || P === '/index.html'), ON_ME = /^\/me\/?$/.test(P);
  if (!ON_HOME && !ON_ME) return;
  var TZ = 'Europe/London', team = '', slug = '', club = null, ch = null, timer = null;
  try { team = localStorage.getItem('nmw_followed_team') || ''; } catch (e) {}
  if (!team) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nm(n) { return String(n || '').toLowerCase().replace(/\s+a?fc$/i, '').replace(/^fc\s+/, '').replace(/[^a-z0-9]/g, ''); }
  function same(a, b) { var x = nm(a), y = nm(b); return !!x && !!y && (x === y || (x.length >= 4 && y.length >= 4 && (x.indexOf(y) === 0 || y.indexOf(x) === 0))); }
  function sh(n) { return String(n || '').replace(/\s+A?FC$/i, ''); }
  function ukDay(iso) { return new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ }); }
  function ukTime(iso) { return new Date(iso).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }); }
  function getJ(u) { return fetch(u + '?t=' + Date.now()).then(function (r) { return r.json(); }); }
  function pick(c) {
    var now = Date.now(), today = ukDay(new Date().toISOString()), list = [].concat(c.recent_results || [], c.next_fixture ? [c.next_fixture] : [], c.upcoming || []), best = null;
    list.forEach(function (x) {
      if (!x || !x.kickoff_utc) return;
      var t = new Date(x.kickoff_utc).getTime();
      if (!(ukDay(x.kickoff_utc) === today || (now >= t && now - t <= 20 * 36e5))) return;
      if (!best || Math.abs(t - now) < Math.abs(new Date(best.kickoff_utc).getTime() - now)) best = x;
    });
    return best;
  }
  function liveFor(fx, d) {
    var L = (d && d.live) || [];
    for (var i = 0; i < L.length; i++) { var l = L[i]; if (l && l.kickoff_utc && Math.abs(new Date(l.kickoff_utc) - new Date(fx.kickoff_utc)) <= 20 * 6e4 && (same(l.home, fx.home) || same(l.away, fx.away))) return l; }
    return null;
  }
  function el() {
    var e = document.getElementById('nmw-md'); if (e) return e;
    e = document.createElement('div'); e.id = 'nmw-md';
    e.style.cssText = 'background:var(--bg-card,#111A2E);border:1px solid var(--accent,#22d3ee);border-radius:14px;padding:14px;margin:12px 0;';
    if (ON_ME) {
      var n = document.getElementById('mh-c-next'), box = document.getElementById('mh-next');
      if (n && n.parentNode) n.parentNode.insertBefore(e, n); else if (box) box.insertBefore(e, box.firstChild); else return null;
    } else {
      var m = document.querySelector('main') || document.getElementById('main'); if (!m) return null; m.insertBefore(e, m.firstChild);
    }
    return e;
  }
  function remove() { var e = document.getElementById('nmw-md'); if (e && e.parentNode) e.parentNode.removeChild(e); }
  function render(fx, lv) {
    var now = Date.now(), t = new Date(fx.kickoff_utc).getTime(), home = same(fx.home, club.name);
    var done = fx.status === 'FINISHED' && fx.home_score != null, live = !!lv || /IN_PLAY|PAUSED|LIVE/.test(fx.status || '');
    if (!done && !live && now - t > 3.5 * 36e5) { remove(); return; }
    var hs = null, as = null, tag, mid;
    if (lv) { hs = lv.home_score; as = lv.away_score; } else if (done) { hs = fx.home_score; as = fx.away_score; }
    if (live) { tag = 'LIVE'; mid = hs != null ? hs + '&ndash;' + as : 'v'; }
    else if (done) { var gf = home ? hs : as, ga = home ? as : hs; tag = 'FULL TIME &middot; ' + (gf > ga ? 'WIN' : (gf < ga ? 'DEFEAT' : 'DRAW')); mid = hs + '&ndash;' + as; }
    else if (now > t) { tag = 'UNDERWAY'; mid = 'v'; }
    else { tag = 'MATCHDAY &middot; KICK-OFF'; mid = esc(ukTime(fx.kickoff_utc)); }
    var h = '<div style="font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--accent,#22d3ee)">' + tag + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px;font-weight:700;font-size:17px"><span>' + esc(sh(fx.home)) + '</span><span>' + mid + '</span><span style="text-align:right">' + esc(sh(fx.away)) + '</span></div>';
    if (!done && !live && ch && ch.win != null && same(ch.opp, home ? fx.away : fx.home)) h += '<div style="font-size:12px;opacity:.8;margin-top:6px">Model: ' + Math.round(ch.win) + '% to win</div>';
    h += '<div style="margin-top:8px;font-size:13px"><a href="/clubs/' + esc(slug) + '/">Club page &rsaquo;</a> &nbsp; <a href="/matches/">All matches &rsaquo;</a></div>';
    var e = el(); if (e) e.innerHTML = h;
  }
  function loop() {
    Promise.all([getJ('/data/clubs/' + slug + '.json'), getJ('/data/fixtures.json').catch(function () { return {}; })]).then(function (r) {
      club = r[0]; var fx = pick(club); if (!fx) { remove(); return; }
      var lv = liveFor(fx, r[1]); render(fx, lv);
      var t = new Date(fx.kickoff_utc).getTime(), now = Date.now(), active = !!lv || (now > t - 3 * 36e5 && now < t + 3.5 * 36e5 && fx.status !== 'FINISHED');
      if (active && !timer) timer = setInterval(loop, 60000);
      if (!active && timer) { clearInterval(timer); timer = null; }
    }).catch(function () {});
  }
  function go() {
    getJ('/data/club_home.json').then(function (d) {
      var hit = null, k;
      for (k in d) if (d[k] && nm(d[k].n) === nm(team)) { hit = d[k]; break; }
      if (!hit) for (k in d) if (d[k] && same(d[k].n, team)) { hit = d[k]; break; }
      if (!hit || !hit.slug) return; ch = hit; slug = hit.slug; loop();
    }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(go, ON_ME ? 1200 : 0); }); else setTimeout(go, ON_ME ? 1200 : 0);
})();
