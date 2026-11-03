(function(){
  var _data=null,_conf='all',_q='',_open={};
  var POP=['england','france','spain','germany','italy','portugal','netherlands','belgium','croatia','brazil','argentina','united states','uruguay','colombia','mexico','japan','morocco','senegal'];
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
  function card(n){
    var fb=esc(n.flag);
    var crest=n.crest?'<img class="nation-crest" src="'+esc(n.crest)+'" alt="" width="36" height="36" loading="lazy" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'"><div class="nation-crest-fallback" style="display:none">'+fb+'</div>':'<div class="nation-crest-fallback">'+fb+'</div>';
    return '<a class="nation-card" href="/nations/'+encodeURIComponent(n.slug)+'/">'+crest+'<div class="nation-info"><div class="nation-name">'+esc(n.name)+'</div>'+(n.squad_count?'<div class="nation-meta">'+esc(n.squad_count)+' players</div>':'')+(n.in_wc_2026?'<div class="nation-wc">WC 2026</div>':'')+'</div></a>';
  }
  function grid(list){var h='<div class="nations-grid">';for(var i=0;i<list.length;i++)h+=card(list[i]);return h+'</div>';}
  function flat(){var out=[],cs=_data.confederations||[];for(var i=0;i<cs.length;i++){var ns=cs[i].nations||[];for(var j=0;j<ns.length;j++)out.push(ns[j]);}return out;}
  function render(){
    if(!_data)return;
    var el=document.getElementById('content'),h='',cs=_data.confederations||[],A=flat();
    var sum=document.getElementById('nx-sum');if(sum)sum.textContent=A.length+' nations · '+cs.length+' confederations';
    if(_q){
      var m=[];for(var i=0;i<A.length;i++){if(norm(A[i].name).indexOf(_q)>-1)m.push(A[i]);}
      el.innerHTML=m.length?'<div class="conf-section"><div class="conf-header">'+m.length+(m.length===1?' match':' matches')+'</div>'+grid(m)+'</div>':'<div class="loading">No nations match "'+esc(_q)+'".</div>';
      return;
    }
    if(_conf==='all'){
      var pop=[];
      for(var p=0;p<POP.length&&pop.length<12;p++){for(var k=0;k<A.length;k++){if(norm(A[k].name)===POP[p]){pop.push(A[k]);break;}}}
      if(pop.length>=6)h+='<div class="conf-section"><div class="conf-header">Popular nations</div>'+grid(pop)+'</div>';
    }
    for(var ci=0;ci<cs.length;ci++){
      var c=cs[ci],ns=c.nations||[],list=[];
      if(_conf!=='all'&&_conf!=='wc'&&c.name!==_conf)continue;
      for(var j=0;j<ns.length;j++){if(_conf==='wc'&&!ns[j].in_wc_2026)continue;list.push(ns[j]);}
      if(!list.length)continue;
      var cap=(_conf==='all'&&!_open[c.name]&&list.length>8)?6:list.length;
      h+='<div class="conf-section"><div class="conf-header">'+esc(c.name)+' &middot; '+esc(c.region)+'</div>'+grid(list.slice(0,cap));
      if(cap<list.length)h+='<button type="button" class="nx-more" data-c="'+esc(c.name)+'">Show all '+list.length+' nations</button>';else if(_conf==='all'&&list.length>8)h+='<button type="button" class="nx-more" data-c="'+esc(c.name)+'">Show fewer</button>';
      h+='</div>';
    }
    el.innerHTML=h||'<div class="loading">No nations found.</div>';
  }
  window.setConf=function(conf,btn){
    _conf=conf;_q='';var q=document.getElementById('nx-q');if(q)q.value='';
    var b=document.querySelectorAll('.filter-btn');for(var i=0;i<b.length;i++)b[i].classList.remove('active');
    if(btn)btn.classList.add('active');
    render();
  };
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.nx-more'):null;
    if(b){var k=b.getAttribute('data-c'),ix=Array.prototype.indexOf.call(document.querySelectorAll('.conf-section'),b.parentNode);_open[k]=_open[k]?0:1;render();if(!_open[k]){var t=document.querySelectorAll('.conf-section')[ix];if(t)t.scrollIntoView({block:'start'});}}
  });
  function init(){
    var f=document.querySelector('.filters');
    if(!f||document.getElementById('nx-q'))return;
    var s=document.createElement('style');
    s.textContent='.nx-box{padding:14px 16px 0;min-height:82px;box-sizing:border-box}#nx-q{width:100%;min-height:44px;padding:10px 14px;border-radius:14px;border:1px solid #1e3157;background:#14203A;color:#e8eef9;font:inherit;font-size:16px}#nx-q::placeholder{color:#9fb0cc}#nx-q:focus{outline:2px solid #22d3ee;outline-offset:1px}.nx-sum{font-size:12px;color:#9fb0cc;margin:8px 2px 0;min-height:16px}.nx-more{display:block;width:100%;min-height:44px;margin:0 0 8px;border-radius:14px;border:1px solid #1e3157;background:#14203A;color:#22d3ee;font:inherit;font-size:13px;font-weight:600;cursor:pointer}.nx-more:hover{border-color:#22d3ee66}';
    document.head.appendChild(s);
    var box=document.querySelector('.nx-box')||document.createElement('div');box.className='nx-box';
    box.innerHTML='<input id="nx-q" type="search" placeholder="Find a nation" aria-label="Find a nation" autocomplete="off" enterkeyhint="search"><div id="nx-sum" class="nx-sum"></div>';
    f.parentNode.insertBefore(box,f);
    document.getElementById('nx-q').addEventListener('input',function(){_q=norm(this.value.trim());render();});
    render();
  }
  fetch('/data/nations.json?v='+Math.floor(Date.now()/600000))
    .then(function(r){return r.json();})
    .then(function(d){_data=d;render();})
    .catch(function(){var c=document.getElementById('content');if(c)c.innerHTML='<div class="loading">Failed to load nations.</div>';});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
