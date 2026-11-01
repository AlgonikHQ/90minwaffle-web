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
