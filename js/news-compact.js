/* NWX1: news pages - first 12 stories, then Show more */
(function(){
  var STEP=12, shown=STEP;
  function run(){
    var list=document.getElementById('nw-list'); if(list==null) return false;
    var items=Array.prototype.slice.call(list.querySelectorAll(':scope > article.nw-st'));
    if(items.length<=STEP) return true;
    var btn=document.createElement('button'); btn.type='button';
    btn.style.cssText='display:block;width:100%;min-height:48px;margin:14px 0;border:1px solid #1e3157;border-radius:14px;background:#111f3a;color:#22d3ee;font:inherit;font-weight:700;font-size:15px;cursor:pointer';
    function draw(){
      items.forEach(function(a,i){ a.style.display = i<shown ? '' : 'none'; });
      var left=items.length-shown;
      if(left>0){ btn.textContent='Show more ('+left+')'; btn.style.display='block'; } else btn.style.display='none';
    }
    btn.addEventListener('click',function(){ shown+=STEP; draw(); });
    list.parentNode.insertBefore(btn, list.nextSibling);
    draw(); return true;
  }
  var k=0; (function w(){ k++; if(run() || k>40) return; setTimeout(w,120); })();
})();

/* NWSTORY_20261109: a tapped push lands on /news/for-you/?story=<id> and shows that story first */
(function () {
  try {
    var id = new URLSearchParams(location.search).get('story'); if (!id) return;
    function run() {
      var list = document.getElementById('nw-list'); if (!list || document.getElementById('nw-story')) return;
      fetch('/data/content.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
        var items = Array.isArray(d) ? d : (d.items || []), it = null;
        for (var i = 0; i < items.length; i++) { if (String(items[i].id) === id) { it = items[i]; break; } }
        if (!it) return;
        var box = document.createElement('section'); box.id = 'nw-story';
        box.style.cssText = 'background:var(--nw-c1,#101c30);border:1px solid var(--nw-ac,#22d3ee);border-radius:14px;padding:14px;margin:6px 0 18px;';
        var tag = document.createElement('div'); tag.textContent = 'FROM YOUR NOTIFICATION';
        tag.style.cssText = 'font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--nw-ac,#22d3ee);margin-bottom:8px;'; box.appendChild(tag);
        var img = it.image || it.image_url;
        if (img) { var im = document.createElement('img'); im.src = img; im.alt = ''; im.style.cssText = 'width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:10px;display:block;'; box.appendChild(im); }
        var h = document.createElement('div'); h.textContent = it.title || it.hook || it.text || '';
        h.style.cssText = 'font-size:18px;font-weight:700;line-height:1.3;color:var(--nw-tx,#fff);margin-bottom:6px;'; box.appendChild(h);
        var m = document.createElement('div'); m.textContent = it.source || '';
        m.style.cssText = 'font-size:12px;color:var(--nw-mu,#8aa);margin-bottom:10px;'; box.appendChild(m);
        if (it.url && /^https?:/.test(it.url)) {
          var a = document.createElement('a'); a.href = it.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Read the story \u2192';
          a.style.cssText = 'display:inline-block;padding:9px 14px;border-radius:10px;background:var(--nw-ac,#22d3ee);color:#04111f;font-weight:700;text-decoration:none;'; box.appendChild(a);
        }
        list.parentNode.insertBefore(box, list);
        try { box.scrollIntoView({ block: 'start' }); } catch (e) {}
      }).catch(function () {});
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  } catch (e) {}
})();
