/* HOME_V5_20261030 */
(function () {
  function ls(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function nm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var team = ls('nmw_followed_team'), boxes = document.querySelectorAll('[data-h5club]');
  if (team && boxes.length) {
    fetch('/data/home_clubs.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
      /* CLUBMATCH_20261030 */ var raw = team; try { var pj = JSON.parse(team); if (pj && typeof pj === 'object') raw = pj.name || pj.team || pj.club || pj.slug || ''; else if (typeof pj === 'string') raw = pj; } catch (e) {}
      var k = nm(raw), k2 = k.replace(/^(afc|fc|cf)/, '').replace(/(afc|fc|cf)$/, ''), c = d[k] || d[k2] || null, h; team = raw;
      if (c === null) { var al = { bayernmunich: 'bayernmunchen', intermilan: 'inter', internazionale: 'inter', acmilan: 'milan', psg: 'parissaintgermain', spurs: 'tottenhamhotspur', tottenham: 'tottenhamhotspur', manutd: 'manchesterunited', manunited: 'manchesterunited', mancity: 'manchestercity', wolves: 'wolverhamptonwanderers', newcastle: 'newcastleunited', westham: 'westhamunited', atletico: 'atleticomadrid', bayern: 'bayernmunchen' }; var k3 = al[k2] || al[k] || k2; for (var x in d) { var n2 = nm(d[x].n).replace(/^(afc|fc|cf)/, '').replace(/(afc|fc|cf)$/, ''), sl = nm(d[x].slug || '').replace(/(afc|fc|cf)$/, ''); if (n2 === k3 || sl === k3 || (k3.length > 4 && (n2.indexOf(k3) === 0 || k3.indexOf(n2) === 0))) { c = d[x]; break; } } }
      if (c === null) {
        h = '<div class="h5-hd"><span class="h5-lbl">YOUR CLUB</span><a href="/me/">Your page →</a></div><b>' + esc(team) + '</b><p class="h5-ft">No fixture in the next two weeks.</p>';
      } else {
        var pills = '';
        String(c.f || '').split('').forEach(function (x) { pills += '<span class="h5-p h5-p' + x + '">' + x + '</span>'; });
        h = '<div class="h5-hd"><span class="h5-lbl">YOUR CLUB</span><a href="' + (c.slug ? '/clubs/' + esc(c.slug) + '/' : '/me/') + '">Club page →</a></div>'
          + '<div class="h5-cl"><b>' + esc(c.n) + '</b><span class="h5-mut">Next: ' + (c.ha === 'H' ? 'v ' : 'at ') + esc(c.opp) + ' · ' + esc(c.ko) + '</span></div>'
          + (pills ? '<div class="h5-pills">Form ' + pills + '</div>' : '')
          + (c.win ? '<div class="h5-mut">Model: ' + Math.round(c.win) + '% to win</div>' : '');
      }
      [].forEach.call(boxes, function (b) { b.innerHTML = h; });
    }).catch(function () {});
  }
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
