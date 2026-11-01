/* TIP_LIVE_20261030: tips already decided mid-match show "Landed ✓" or "Lost ✗" straight away. Official record still settles at full time. */
(function(){
  var css = '.tl-b{display:inline-block;padding:3px 9px;border-radius:999px;font-weight:700;font-size:12px;letter-spacing:.02em;white-space:nowrap}'
    + '.tl-landed{background:rgba(61,220,132,.15);color:#3DDC84;border:1px solid rgba(61,220,132,.45)}.tl-lost{background:rgba(255,122,127,.12);color:#ff7a7f;border:1px solid rgba(255,122,127,.45)}';
  try { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); } catch (e) {}
  function label(t){ return (t.state === 'landed' ? 'Landed ✓' : 'Lost ✗') + (t.minute ? ' ' + t.minute + "'" : ''); }
  function badge(el, t){ el.textContent = label(t); el.className = 'tl-b tl-' + t.state; el.setAttribute('title', 'Already decided at ' + t.score + ' - the record updates at full time'); }
  function apply(map){
    Object.keys(map).forEach(function(id){
      var t = map[id];
      var a = document.querySelector('[data-tid="' + id + '"] .hv3-st'); if (a) badge(a, t);
      document.querySelectorAll('span,div').forEach(function(el){
        if (el.children.length || !/^\s*pending\s*$/i.test(el.textContent || '')) return;
        var c = el, i = 0; while (c && i < 7) { c = c.parentNode; i++; if (c && c.textContent && c.textContent.indexOf(t.home) >= 0 && c.textContent.indexOf(t.away) >= 0) { badge(el, t); return; } }
      });
    });
  }
  function load(){ fetch('/data/tip_live.json?_=' + Date.now()).then(function(r){ return r.json(); }).then(function(j){ if (j && j.tips) apply(j.tips); }).catch(function(){}); }
  load(); setInterval(load, 60000);
})();
