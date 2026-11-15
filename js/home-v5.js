/* HOME_V5_20261030 */
/* DESKBARS_20261111 */
(function () {
  var els = [].slice.call(document.querySelectorAll('[data-abid][data-dk]')); if (!els.length) return; var n = 0;
  function go() {
    if (window.actionBar) {
      var ids = []; els.forEach(function (b) { var id = b.getAttribute('data-abid'); ids.push(id); b.innerHTML = window.actionBar(id, b.getAttribute('data-t'), 'desk'); });
      fetch('/api/react/bulk?ids=' + ids.join(','), { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
        window.REACT_COUNTS = window.REACT_COUNTS || {};
        els.forEach(function (b) { var id = b.getAttribute('data-abid'); if (d && d[id]) { window.REACT_COUNTS[id] = d[id]; b.innerHTML = window.actionBar(id); } });
      }).catch(function () {});
    } else if (n++ < 60) {
      if (n === 2 && !document.querySelector('script[src*="action-bar.js"]')) { var s = document.createElement('script'); s.src = '/js/action-bar.js?v=20261024m'; document.head.appendChild(s); }
      setTimeout(go, 150);
    }
  }
  go();
})();
(function () {
  function ls(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function nm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var team = ls('nmw_followed_team'), boxes = document.querySelectorAll('[data-h5club]');
  if (team && boxes.length) {
    fetch('/data/club_home.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
      /* CLUBMATCH_20261030 */ var raw = team; try { var pj = JSON.parse(team); if (pj && typeof pj === 'object') raw = pj.name || pj.team || pj.club || pj.slug || ''; else if (typeof pj === 'string') raw = pj; } catch (e) {}
      var k = nm(raw), k2 = k.replace(/^(afc|fc|cf)/, '').replace(/(afc|fc|cf)$/, ''), c = d[k] || d[k2] || null, h; team = raw;
      if (c === null) { var al = { bayernmunich: 'bayernmunchen', intermilan: 'inter', internazionale: 'inter', acmilan: 'milan', psg: 'parissaintgermain', spurs: 'tottenhamhotspur', tottenham: 'tottenhamhotspur', manutd: 'manchesterunited', manunited: 'manchesterunited', mancity: 'manchestercity', wolves: 'wolverhamptonwanderers', newcastle: 'newcastleunited', westham: 'westhamunited', atletico: 'atleticomadrid', bayern: 'bayernmunchen' }; var k3 = al[k2] || al[k] || k2; for (var x in d) { var n2 = nm(d[x].n).replace(/^(afc|fc|cf)/, '').replace(/(afc|fc|cf)$/, ''), sl = nm(d[x].slug || '').replace(/(afc|fc|cf)$/, ''); if (n2 === k3 || sl === k3 || (k3.length > 4 && (n2.indexOf(k3) === 0 || k3.indexOf(n2) === 0))) { c = d[x]; break; } } }
      if (c === null) {
        h = '<div class="h5-hd"><span class="h5-lbl">YOUR CLUB</span><a href="/me/">Your page →</a></div><b>' + esc(team) + '</b><p class="h5-ft">Open your page for news and fixtures for this club.</p>';
      } else {
        var pills = '';
        String(c.f || '').split('').forEach(function (x) { pills += '<span class="h5-p h5-p' + x + '">' + x + '</span>'; });
        h = '<div class="h5-hd"><span class="h5-lbl">YOUR CLUB</span><a href="' + (c.slug ? '/clubs/' + esc(c.slug) + '/' : '/me/') + '">Club page →</a></div>'
          + '<div class="h5-cl"><b>' + esc(c.n) + '</b><span class="h5-mut">' + (c.opp ? 'Next: ' + (c.ha === 'H' ? 'v ' : 'at ') + esc(c.opp) + ' · ' + esc(c.ko) : 'No game in the next two weeks') + '</span></div>'
          + (pills ? '<div class="h5-pills" title="Last 5 league games, latest on the right">League form ' + pills + '</div>' : '')
          + (c.pts != null ? '<div class="h5-mut">' + esc(c.pl) + ' played · ' + esc(c.pts) + ' pts</div>' : '')
          + (c.win ? '<div class="h5-mut">Model: ' + Math.round(c.win) + '% to win</div>' : '')
          + (c.o && c.o.p ? (function () { var xs = (c.o.x || []).filter(function (r) { return r[1] >= 1 && r[1] <= 99; }).slice(0, 3).map(function (r) { return esc(String(r[0]).replace(/ \(.*\)/, '')) + ' ' + Math.round(r[1]) + '%'; }), pn = Math.round(c.o.p), sf = (pn % 100 > 10 && pn % 100 < 14) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[pn % 10] || 'th'); return '<div class="h5-mut">Model forecast: finishes about ' + pn + sf + (xs.length ? ' · ' + xs.join(' · ') : '') + '</div>'; })() : '');
      }
      [].forEach.call(boxes, function (b) { b.innerHTML = h; });
    }).catch(function () {});
  }
  /* COUNTRYCARD_20261109: the fan's country steps forward when it is live, within 48h of kick-off, or just finished */
  (function () {
    var raw = ls('nmw_followed_country'); if (!raw) return;
    try { var pj = JSON.parse(raw); if (pj && typeof pj === 'object') raw = pj.name || pj.country || pj.team || pj.slug || ''; else if (typeof pj === 'string') raw = pj; } catch (e) {}
    var key = nm(raw), cb = document.querySelectorAll('[data-h5club]'); if (!key || !cb.length) return;
    function uk(iso) { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)).replace(',', ''); } catch (e) { return ''; } }
    function pl(f) { var p = ''; String(f || '').split('').forEach(function (x) { p += '<span class="h5-p h5-p' + x + '">' + x + '</span>'; }); return p; }
    function cp(c) { return String(c || '').split(' \u00b7 ')[0]; }
    var CSL = '';  /* COUNTRYLINK_20261109 */
    function hd(t) { return '<div class="h5-hd"><span class="h5-lbl' + (t.indexOf('LIVE') > -1 ? ' h5-red' : '') + '">' + t + '</span><a href="' + (CSL ? '/nations/' + CSL + '/' : '/me/') + '">Country page \u2192</a></div>'; }
    Promise.all([
      fetch('/data/country_home.json?t=' + Date.now()).then(function (r) { return r.json(); }).catch(function () { return null; }),
      fetch('/data/live_now.json?t=' + Date.now()).then(function (r) { return r.json(); }).catch(function () { return null; })
    ]).then(function (res) {
      var d = res[0], lv = res[1]; if (!d) return;
      var c = d[key]; if (!c) { for (var x in d) { if (nm(d[x].n) === key) { c = d[x]; break; } } } if (!c) return;
      CSL = String(c.n || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      var now = Date.now(), live = null, fx = c.nx, last = c.ls, f = pl(c.f), top = true, h;
      try { if (lv && lv.matches && now - Date.parse(lv.generated_at) < 15 * 60000) lv.matches.forEach(function (m) { if (!live && (nm(m.home) === key || nm(m.away) === key)) live = m; }); } catch (e) {}
      if (live) {
        var mn = live.minute; mn = (mn == null || mn === '') ? '' : (/^\d+(\+\d+)?$/.test(String(mn)) ? mn + '\u2032' : mn);
        h = hd('\u25cf LIVE \u00b7 ' + esc(c.n).toUpperCase()) + '<div class="h5-cl"><b>' + esc(live.home) + ' ' + esc(live.home_score) + '\u2013' + esc(live.away_score) + ' ' + esc(live.away) + '</b><span class="h5-mut">' + esc(mn) + '</span></div>';
      } else if (fx && Date.parse(fx.ko) > now - 3 * 3600000 && Date.parse(fx.ko) < now + 48 * 3600000) {
        h = hd('YOUR COUNTRY \u00b7 NEXT UP') + '<div class="h5-cl"><b>' + esc(fx.h) + ' v ' + esc(fx.a) + '</b><span class="h5-mut">' + uk(fx.ko) + (cp(fx.c) ? ' \u00b7 ' + esc(cp(fx.c)) : '') + '</span></div>' + (f ? '<div class="h5-pills" title="Last 5 results, latest on the right">Form ' + f + '</div>' : '');
      } else if (last && last.sc && Date.parse(last.ko) < now && Date.parse(last.ko) > now - 24 * 3600000) {
        h = hd('YOUR COUNTRY \u00b7 FULL TIME') + '<div class="h5-cl"><b>' + esc(c.n) + ' ' + esc(last.sc) + ' ' + esc(last.opp) + '</b><span class="h5-mut">' + (last.ih ? 'home' : 'away') + (cp(last.c) ? ' \u00b7 ' + esc(cp(last.c)) : '') + '</span></div>' + (f ? '<div class="h5-pills" title="Last 5 results, latest on the right">Form ' + f + '</div>' : '');
      } else {
        top = false;
        h = hd('YOUR COUNTRY') + '<div class="h5-cl"><b>' + esc(c.n) + '</b><span class="h5-mut">' + (fx ? 'Next: ' + esc(fx.h) + ' v ' + esc(fx.a) + ' \u00b7 ' + uk(fx.ko) : 'Next game not confirmed in our data yet') + '</span></div>' + (f ? '<div class="h5-pills" title="Last 5 results, latest on the right">Form ' + f + '</div>' : '') + (last && last.sc ? '<div class="h5-mut">Last: ' + esc(c.n) + ' ' + esc(last.sc) + ' ' + esc(last.opp) + ' \u00b7 ' + uk(last.ko) + '</div>' : '');
      }
      [].forEach.call(cb, function (b) { var el = document.createElement('div'); el.className = 'h5-card h5-ctry'; el.setAttribute('style', 'margin:12px 0'); el.innerHTML = h; b.parentNode.insertBefore(el, top ? b : b.nextSibling); });
    });
  })();
  function uid() {
    var ks = ['nmw_uid', 'nmw_voter_id', 'nmw_vid'];
    for (var i = 0; i < ks.length; i++) { var v = ls(ks[i]); if (v) return v; }
    var n = 'v' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem('nmw_uid', n); } catch (e) {}
    return n;
  }
  [].forEach.call(document.querySelectorAll('.h5-fans'), function (f) {
    var pid = f.getAttribute('data-poll'), box = f.querySelector('.h5-vbs');
    if (ls('nmw_h5_voted_' + pid)) { box.innerHTML = '<span class="h5-ok">You voted ✓</span>'; return; }
    [].forEach.call(f.querySelectorAll('.h5-vb'), function (b) {
      b.addEventListener('click', function () {
        fetch('/poll/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ poll_id: pid, answer: b.getAttribute('data-opt'), voter_id: uid() }) }).catch(function () {});
        try { localStorage.setItem('nmw_h5_voted_' + pid, '1'); } catch (e) {}
        box.innerHTML = '<span class="h5-ok">Vote counted ✓</span>';
      });
    });
  });
  function openMatch(el) { var id = el.getAttribute('data-mid'); if (typeof window.nmwOpenSheet === 'function') window.nmwOpenSheet(id); else location.href = '/matches/match/?id=' + encodeURIComponent(id); }
  document.addEventListener('click', function (e) { var el = e.target.closest ? e.target.closest('[data-mid]') : null; if (el == null || e.target.closest('a,button')) return; openMatch(el); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.hasAttribute && e.target.hasAttribute('data-mid')) openMatch(e.target); });
})();

/* FOLLOWLIVE_20261111: live card only for the fan's own club or one of up to three extra clubs (the country has its own card) */
(function () {
  var boxes = document.querySelectorAll('[data-h5follow]'); if (!boxes.length) return;
  function ls(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\b(fc|afc|cf|sc|the)\b/g, '').replace(/[^a-z0-9]/g, ''); }
  function mt(a, b) { a = nm(a); b = nm(b); return !!a && !!b && (a === b || (Math.min(a.length, b.length) >= 6 && (a.indexOf(b) > -1 || b.indexOf(a) > -1))); }
  function nmOf(raw) { try { var p = JSON.parse(raw); if (p && typeof p === 'object') raw = p.name || p.team || p.club || p.slug || ''; else if (typeof p === 'string') raw = p; } catch (e) {} return raw; }
  function mine() { var out = [], t = nmOf(ls('nmw_followed_team')), x = []; try { x = JSON.parse(ls('nmw_extra_teams') || '[]'); } catch (e) {} if (t) out.push(t); (Array.isArray(x) ? x : []).slice(0, 3).forEach(function (e) { e = typeof e === 'string' ? e : (e && (e.name || e.team || e.slug)) || ''; if (e) out.push(e); }); return out; }
  function lab(m) { var s = String(m.status || ''), n = parseInt(m.minute, 10); if (s === 'HT') return 'HT'; if (isNaN(n)) return s || 'LIVE'; if (n > 90) return '90+\u2032'; if (s === '1H' && n > 45) return '45+\u2032'; return n + '\u2032'; }
  function paint(d) {
    var me = mine(), rows = [];
    if (me.length && d && d.matches && Date.now() - Date.parse(d.generated_at) < 15 * 60000) d.matches.forEach(function (m) { if (/^(FT|AET|PEN)$/.test(String(m.status || ''))) return; if (me.some(function (t) { return mt(t, m.home) || mt(t, m.away); })) rows.push(m); });
    [].forEach.call(boxes, function (b) {
      if (!rows.length) { b.hidden = true; b.innerHTML = ''; return; }
      var h = '<div class="h5-hd"><span class="h5-lbl h5-red">\u25cf LIVE \u00b7 YOUR TEAMS</span><a class="h5-alllive" href="/matches/">All live \u2192</a></div><div class="h5-card h5-live">';
      rows.forEach(function (m) { h += '<div class="h5-lr"' + (m.bsd_id ? ' data-mid="BSD_' + esc(m.bsd_id) + '" tabindex="0" role="button"' : '') + '><span class="h5-lm">' + esc(lab(m)) + '</span><span class="h5-lt"><span>' + esc(m.home) + '</span><span>' + esc(m.away) + '</span></span><span class="h5-ls"><span>' + esc(m.home_score == null ? 0 : m.home_score) + '</span><span>' + esc(m.away_score == null ? 0 : m.away_score) + '</span></span></div>'; });
      b.innerHTML = h + '</div>'; b.hidden = false;
    });
  }
  function tick() { if (document.hidden) return; fetch('/data/live_now.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(paint).catch(function () {}); }
  tick(); setInterval(tick, 15000); document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
