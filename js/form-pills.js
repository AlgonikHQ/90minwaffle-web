/* FORMPILLS_20261030 v4: turns each tip card's form letters (e.g. "DLLWL") into coloured pills - home on the left, away on the right, latest result on the right. */
(function(){
  var css = '.fp-row{align-items:center}.fp-s{display:inline-flex;gap:3px;letter-spacing:0!important}'
    + '.fp{display:inline-flex;width:20px;height:20px;border-radius:50%;align-items:center;justify-content:center;font-style:normal;font-size:11px;font-weight:700}'
    + '.fp-W{background:#3DDC84;color:#0B1220}.fp-D{background:#3a4660;color:#E8EDF5}.fp-L{background:#ff7a7f;color:#0B1220}';
  try { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); } catch (e) {}
  var NAME = { W: 'Win', D: 'Draw', L: 'Loss' };
  function run(){
    document.querySelectorAll('span').forEach(function(sp){
      if (sp.getAttribute('data-fp')) return;
      var t = (sp.textContent || '').trim();
      if (!/^[WDL]{3,6}$/.test(t) || !sp.style || sp.style.letterSpacing !== '2px') return;
      sp.setAttribute('data-fp', '1'); sp.classList.add('fp-s');
      sp.setAttribute('aria-label', 'Form, last ' + t.length + ': ' + t.split('').map(function(c){ return NAME[c]; }).join(', ') + ' (latest last)');
      sp.innerHTML = t.split('').map(function(c){ return '<i class="fp fp-' + c + '" aria-hidden="true" title="' + NAME[c] + '">' + c + '</i>'; }).join('');
      if (sp.parentNode && sp.parentNode.classList) sp.parentNode.classList.add('fp-row');
    });
  }
  run();
  try { new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
})();
