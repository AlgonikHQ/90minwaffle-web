/* NMW_MATCHDAY_20261110b: matchday cards for the followed club (before/live/full time) and country (kick-off/full time). Home and Me only. */
(function () {
  'use strict';
  if (window.__nmwMatchday) return; window.__nmwMatchday = true;
  var P = location.pathname, ON_HOME = (P === '/' || P === '/index.html'), ON_ME = /^\/me\/?$/.test(P);
  if (!ON_HOME && !ON_ME) return;
  var TZ = 'Europe/London', slug = '', club = null, ch = null, timer = null, ctimer = null;
  function lsg(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  var team = lsg('nmw_followed_team'), country = lsg('nmw_followed_country');
  try { var j = JSON.parse(country); if (j && typeof j === 'object') country = j.name || j.country || ''; else if (typeof j === 'string') country = j; } catch (e) {}
  if (!team && !country) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nm(n) { return String(n || '').toLowerCase().replace(/\s+a?fc$/i, '').replace(/^fc\s+/, '').replace(/[^a-z0-9]/g, ''); }
  function same(a, b) { var x = nm(a), y = nm(b); return !!x && !!y && (x === y || (x.length >= 4 && y.length >= 4 && (x.indexOf(y) === 0 || y.indexOf(x) === 0))); }
  function sh(n) { return String(n || '').replace(/\s+A?FC$/i, ''); }
  function slugify(n) { return String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function ukDay(iso) { return new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ }); }
  function ukTime(iso) { return new Date(iso).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }); }
  function getJ(u) { return fetch(u + '?t=' + Date.now()).then(function (r) { return r.json(); }); }
  var CARD = 'background:var(--bg-card,#111A2E);border:1px solid var(--accent,#22d3ee);border-radius:14px;padding:14px;margin:12px 0;position:relative;z-index:1;';
  function wrap(force) {
    var w = document.getElementById('nmw-mdw'); if (w) return w;
    var host = null, ref = null;
    if (ON_ME) { ref = document.getElementById('mh-c-next'); var box = document.getElementById('mh-next'); if (ref) host = ref.parentNode; else if (force && box) { host = box; ref = box.firstChild; } }
    else {
      var hs = document.querySelectorAll('.h5-sec .h5-hd h2'), tgt = null, i;
      for (i = 0; i < hs.length; i++) if (hs[i].textContent.trim() === 'Today') { tgt = hs[i].closest('.h5-sec'); break; }
      if (!tgt) { var all = document.querySelectorAll('.h5-sec'); tgt = all[1] || null; }
      if (tgt && tgt.parentNode) { host = tgt.parentNode; ref = tgt; }
      else { var m = document.querySelector('main') || document.getElementById('main'); if (m) { host = m; ref = m.firstChild; } }
    }
    if (!host) return null;
    w = document.createElement('div'); w.id = 'nmw-mdw'; host.insertBefore(w, ref); return w;
  }
  function slot(id, force) {
    var e = document.getElementById(id); if (e) return e;
    var w = wrap(force); if (!w) return null;
    e = document.createElement('div'); e.id = id; e.style.cssText = CARD;
    if (id === 'nmw-md') w.insertBefore(e, w.firstChild); else w.appendChild(e);
    return e;
  }
  function drop(id) {
    var e = document.getElementById(id); if (e && e.parentNode) e.parentNode.removeChild(e);
    var w = document.getElementById('nmw-mdw'); if (w && !w.firstChild && w.parentNode) w.parentNode.removeChild(w);
  }
  function show(id, html, n) {
    n = n || 0; var e = slot(id, n >= 8);
    if (e) { e.innerHTML = html; return; }
    if (n < 12) setTimeout(function () { show(id, html, n + 1); }, 500);
  }
  function head(tag, l, mid, r, note, links) {
    return '<div style="font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--accent,#22d3ee)">' + tag + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px;font-weight:700;font-size:17px"><span>' + esc(l) + '</span><span>' + mid + '</span><span style="text-align:right">' + esc(r) + '</span></div>' +
      (note ? '<div style="font-size:12px;opacity:.8;margin-top:6px">' + note + '</div>' : '') +
      '<div style="margin-top:8px;font-size:13px">' + links + '</div>';
  }
  /* ---------- club ---------- */
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
  function render(fx, lv) {
    var now = Date.now(), t = new Date(fx.kickoff_utc).getTime(), home = same(fx.home, club.name);
    var done = fx.status === 'FINISHED' && fx.home_score != null, live = !!lv || /IN_PLAY|PAUSED|LIVE/.test(fx.status || '');
    if (!done && !live && now - t > 3.5 * 36e5) { drop('nmw-md'); return; }
    var hs = null, as = null, tag, mid;
    if (lv) { hs = lv.home_score; as = lv.away_score; } else if (done) { hs = fx.home_score; as = fx.away_score; }
    if (live) { tag = 'LIVE'; mid = hs != null ? hs + '&ndash;' + as : 'v'; }
    else if (done) { var gf = home ? hs : as, ga = home ? as : hs; tag = 'FULL TIME &middot; ' + (gf > ga ? 'WIN' : (gf < ga ? 'DEFEAT' : 'DRAW')); mid = hs + '&ndash;' + as; }
    else if (now > t) { tag = 'UNDERWAY'; mid = 'v'; }
    else { tag = 'MATCHDAY &middot; KICK-OFF'; mid = esc(ukTime(fx.kickoff_utc)); }
    var note = (!done && !live && ch && ch.win != null && same(ch.opp, home ? fx.away : fx.home)) ? 'Model: ' + Math.round(ch.win) + '% to win' : '';
    show('nmw-md', head(tag, sh(fx.home), mid, sh(fx.away), note, '<a href="/clubs/' + esc(slug) + '/">Club page &rsaquo;</a> &nbsp; <a href="/matches/">All matches &rsaquo;</a>'));
  }
  function loop() {
    Promise.all([getJ('/data/clubs/' + slug + '.json'), getJ('/data/fixtures.json').catch(function () { return {}; })]).then(function (r) {
      club = r[0]; var fx = pick(club); if (!fx) { drop('nmw-md'); return; }
      var lv = liveFor(fx, r[1]); render(fx, lv);
      var t = new Date(fx.kickoff_utc).getTime(), now = Date.now(), active = !!lv || (now > t - 3 * 36e5 && now < t + 3.5 * 36e5 && fx.status !== 'FINISHED');
      if (active && !timer) timer = setInterval(loop, 60000);
      if (!active && timer) { clearInterval(timer); timer = null; }
    }).catch(function () {});
  }
  function goClub() {
    getJ('/data/club_home.json').then(function (d) {
      var hit = null, k;
      for (k in d) if (d[k] && nm(d[k].n) === nm(team)) { hit = d[k]; break; }
      if (!hit) for (k in d) if (d[k] && same(d[k].n, team)) { hit = d[k]; break; }
      if (!hit || !hit.slug) return; ch = hit; slug = hit.slug; loop();
    }).catch(function () {});
  }
  /* ---------- country ---------- */
  function renderC(t) {
    var now = Date.now(), today = ukDay(new Date().toISOString()), nx = t.next, la = t.last, nme = t.name || country, link = '<a href="/nations/' + esc(slugify(nme)) + '/">Nation page &rsaquo;</a> &nbsp; <a href="/matches/">All matches &rsaquo;</a>';
    if (la && la.kickoff_utc) {
      var ago = now - new Date(la.kickoff_utc).getTime();
      if (ago >= 0 && ago <= 20 * 36e5 && la.score) {
        var word = { W: 'WIN', D: 'DRAW', L: 'DEFEAT' }[la.result] || '';
        show('nmw-mdc', head('FULL TIME' + (word ? ' &middot; ' + word : ''), nme, esc(la.score), la.opponent, la.competition ? esc(la.competition) : '', link)); return;
      }
    }
    if (nx && nx.kickoff_utc) {
      var t0 = new Date(nx.kickoff_utc).getTime();
      if (ukDay(nx.kickoff_utc) === today && now - t0 <= 12 * 36e5) {
        var before = now < t0;
        show('nmw-mdc', head(before ? 'MATCHDAY &middot; KICK-OFF' : 'KICKED OFF', nx.home, before ? esc(ukTime(nx.kickoff_utc)) : 'v', nx.away,
          (nx.competition ? esc(nx.competition) : '') + (before ? '' : ' &middot; score added after full time'), link)); return;
      }
    }
    drop('nmw-mdc');
  }
  function loopC() {
    getJ('/data/nations_current.json').then(function (d) {
      var T = d.teams || {}, k, hit = null;
      for (k in T) if (T[k] && (nm(T[k].name) === nm(country) || k === slugify(country))) { hit = T[k]; break; }
      if (!hit) return; renderC(hit);
      if (!ctimer) ctimer = setInterval(loopC, 300000);
    }).catch(function () {});
  }
  function go() { if (team) goClub(); if (country) loopC(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(go, ON_ME ? 1200 : 0); }); else setTimeout(go, ON_ME ? 1200 : 0);
})();
