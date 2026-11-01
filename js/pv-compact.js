/* PVX1: Previews - Today / Tomorrow / Later tabs, league chips, compact rows */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var TABS=[['today','Today'],['tomorrow','Tomorrow'],['week','Later this week']];
  var ORDER=['Premier League','Championship','La Liga','Serie A','Bundesliga','Ligue 1','Scottish Premiership','Eredivisie','Primeira Liga'];
  var host=null, panes={}, links={}, chips=null, cur='today';
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function ymd(d){ return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
  function css(){
    var s=document.createElement('style');
    s.textContent='@media (min-width:900px){.page.hiw.seo{max-width:1100px'+IMP+'}}'+
      '#pvx{margin-top:14px}.pvx-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}'+
      '.pvx-tabs a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+'}'+
      '.pvx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.pvx-tabs small{opacity:.75;font-weight:500;margin-left:5px}'+
      '.pvx-chips{display:flex;gap:6px;overflow-x:auto;padding:0 0 4px;margin:0 0 14px;scrollbar-width:none}.pvx-chips::-webkit-scrollbar{display:none}'+
      '.pvx-chips button{flex:none;min-height:36px;padding:6px 12px;border-radius:999px;border:1px solid #1e3157;background:transparent;color:#c5d2e8;font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}'+
      '.pvx-chips button[aria-pressed="true"]{background:#122446;color:#22d3ee;border-color:#22d3ee}'+
      '.pvx-tabs a:focus-visible,.pvx-chips button:focus-visible,.pvx-row:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.pvx-pane{display:none}.pvx-pane.on{display:block}'+
      '.pvx-list{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}@media (min-width:900px){.pvx-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}'+
      '.pvx-row{display:grid;grid-template-columns:46px minmax(0,1fr) 96px;gap:10px;align-items:center;background:#111f3a;border:1px solid #1e3157;border-radius:14px;padding:12px 14px;cursor:pointer}'+
      '.pvx-row:hover{border-color:#22d3ee}.pvx-t{font-weight:800;color:#e6edf7;font-size:14px}'+
      '.pvx-m{min-width:0;display:flex;flex-direction:column;gap:3px}'+
      '.pvx-m a.pvx-a{color:#e6edf7'+IMP+';text-decoration:none'+IMP+';font-size:14.5px;line-height:1.3}.pvx-m a.pvx-a b{font-weight:700}'+
      '.pvx-m small,.pvx-p small{color:#9fb0cc;font-size:12px}.pvx-p{display:flex;flex-direction:column;gap:5px;align-items:flex-end}'+
      '.pvx-bar{display:flex;width:100%;height:6px;border-radius:3px;overflow:hidden;background:#1b2a4a}'+
      '.pvx-bar i:nth-child(1){background:#22d3ee}.pvx-bar i:nth-child(2){background:#3b4f75}.pvx-bar i:nth-child(3){background:#c5d2e8}'+
      '.pvx-pane details{margin:0 0 12px;border:1px solid #1e3157;border-radius:14px;padding:2px 12px 12px;background:#0d1830}'+
      '.pvx-pane summary{cursor:pointer;padding:12px 0;font-weight:700;color:#22d3ee;list-style:none;display:flex;justify-content:space-between;align-items:center}'+
      '.pvx-pane summary::-webkit-details-marker{display:none}.pvx-pane summary small{color:#9fb0cc;font-weight:500}'+
      '.pvx-day{font-size:13px;color:#9fb0cc;margin:0 0 8px}'+
      '.pvx-empty{padding:16px;border:1px dashed #2b4573;border-radius:14px;color:#9fb0cc;font-size:14px}';
    document.head.appendChild(s);
  }
  function rowify(p){
    var a=p.querySelector('a[href^="/preview/"]'), meta=p.querySelector('.muted');
    var parts=(meta ? txt(meta) : '').split('\u00b7').map(function(x){ return x.trim(); });
    var time=parts[0]||'', lg=parts[1]||'Other', nums=((parts[2]||'').match(/\d+/g)||[]).map(Number);
    var row=document.createElement('div'); row.className='pvx-row'; row.setAttribute('data-lg',lg); row.tabIndex=0;
    var bar = nums.length==3 ? '<span class="pvx-bar" aria-hidden="true"><i style="width:'+nums[0]+'%"></i><i style="width:'+nums[1]+'%"></i><i style="width:'+nums[2]+'%"></i></span><small>'+nums.join(' \u00b7 ')+'</small>' : '';
    row.innerHTML='<span class="pvx-t">'+esc(time)+'</span><div class="pvx-m"></div><div class="pvx-p">'+bar+'</div>';
    a.classList.add('pvx-a');
    if(nums.length==3) a.setAttribute('aria-label', txt(a)+', '+time+', model '+nums[0]+' percent home, '+nums[1]+' draw, '+nums[2]+' away');
    var m=row.querySelector('.pvx-m'); m.appendChild(a);
    var s=document.createElement('small'); s.textContent=lg; m.appendChild(s);
    row.addEventListener('click',function(e){ if(e.target.closest('a')) return; a.click(); });
    row.addEventListener('keydown',function(e){ if(e.key=='Enter' && e.target===row) a.click(); });
    p.remove();
    return row;
  }
  function list(rows){ var l=document.createElement('div'); l.className='pvx-list'; rows.forEach(function(r){ l.appendChild(r); }); return l; }
  function buildChips(t){
    var seen={}; Array.prototype.forEach.call(panes[t].querySelectorAll('.pvx-row'),function(r){ var g=r.getAttribute('data-lg'); seen[g]=(seen[g]||0)+1; });
    var lgs=Object.keys(seen).sort(function(a,b){ var ia=ORDER.indexOf(a), ib=ORDER.indexOf(b); ia = ia<0 ? 99 : ia; ib = ib<0 ? 99 : ib; return ia-ib || a.localeCompare(b); });
    chips.innerHTML='';
    if(lgs.length<2){ chips.style.display='none'; return; }
    chips.style.display='';
    [['', 'All']].concat(lgs.map(function(g){ return [g, g+' \u00b7 '+seen[g]]; })).forEach(function(c){
      var b=document.createElement('button'); b.type='button'; b.setAttribute('data-lg',c[0]); b.textContent=c[1];
      b.setAttribute('aria-pressed', c[0]=='' ? 'true' : 'false'); chips.appendChild(b);
    });
  }
  function filter(g){
    Array.prototype.forEach.call(chips.querySelectorAll('button'),function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lg')==g ? 'true' : 'false'); });
    var p=panes[cur];
    Array.prototype.forEach.call(p.querySelectorAll('.pvx-row'),function(r){ r.style.display = (g=='' || r.getAttribute('data-lg')==g) ? '' : 'none'; });
    Array.prototype.forEach.call(p.querySelectorAll('details'),function(d){
      var any=Array.prototype.some.call(d.querySelectorAll('.pvx-row'),function(r){ return r.style.display==''; });
      d.style.display = any ? '' : 'none'; if(g && any) d.open=true;
    });
  }
  function show(t, push){
    if(panes[t]==null) t='today';
    cur=t;
    TABS.forEach(function(x){ panes[x[0]].classList.toggle('on', x[0]==t); links[x[0]].classList.toggle('on', x[0]==t); links[x[0]].setAttribute('aria-selected', x[0]==t ? 'true' : 'false'); });
    buildChips(t);
    if(push) history.pushState({pvx:t},'','/preview/?tab='+t);
  }
  function build(){
    var page=document.querySelector('.page.hiw.seo'); if(page==null) return false;
    var hs=Array.prototype.filter.call(page.children,function(e){ return e.tagName=='H2'; });
    var groups=[];
    hs.forEach(function(h){
      var rows=[], n=h.nextElementSibling;
      while(n && n.tagName=='P' && n.querySelector('a[href^="/preview/"]')){ rows.push(n); n=n.nextElementSibling; }
      if(rows.length){
        var m=(rows[0].querySelector('a[href^="/preview/"]').getAttribute('href')||'').match(/(\d{4}-\d{2}-\d{2})\/?$/);
        groups.push({h:h, title:txt(h), date: m ? m[1] : '', rows:rows});
      }
    });
    if(groups.length==0) return false;
    css();
    var now=new Date(), t0=ymd(now), t1=ymd(new Date(now.getTime()+864e5));
    host=document.createElement('div'); host.id='pvx';
    groups[0].h.parentNode.insertBefore(host, groups[0].h);
    var nav=document.createElement('nav'); nav.className='pvx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Preview days');
    chips=document.createElement('div'); chips.className='pvx-chips'; chips.setAttribute('aria-label','Filter by league');
    host.appendChild(nav); host.appendChild(chips);
    var n={today:0, tomorrow:0, week:0};
    TABS.forEach(function(x){ var p=document.createElement('div'); p.className='pvx-pane'; p.setAttribute('role','tabpanel'); panes[x[0]]=p; host.appendChild(p); });
    var firstLater=true;
    groups.forEach(function(g){
      var rows=g.rows.map(rowify); g.h.remove();
      if(g.date==t0 || g.date==t1){
        var k = g.date==t0 ? 'today' : 'tomorrow';
        var d=document.createElement('div'); d.className='pvx-day'; d.textContent=g.title+' \u00b7 '+rows.length+' matches';
        panes[k].appendChild(d); panes[k].appendChild(list(rows)); n[k]+=rows.length;
      } else {
        var det=document.createElement('details'); det.open=firstLater; firstLater=false;
        det.innerHTML='<summary><span>'+esc(g.title)+'</span><small>'+rows.length+' matches \u25be</small></summary>';
        det.appendChild(list(rows)); panes.week.appendChild(det); n.week+=rows.length;
      }
    });
    if(n.today==0) panes.today.innerHTML='<div class="pvx-empty">No more previews today. Tomorrow\u2019s are ready in the next tab.</div>';
    if(n.tomorrow==0) panes.tomorrow.innerHTML='<div class="pvx-empty">No previews for tomorrow yet.</div>';
    if(n.week==0) panes.week.innerHTML='<div class="pvx-empty">Nothing further out yet. New previews land daily.</div>';
    TABS.forEach(function(x){
      var a=document.createElement('a'); a.href='/preview/?tab='+x[0]; a.setAttribute('role','tab');
      a.innerHTML=x[1]+(n[x[0]] ? '<small>'+n[x[0]]+'</small>' : '');
      a.addEventListener('click',function(e){ e.preventDefault(); show(x[0], true); });
      nav.appendChild(a); links[x[0]]=a;
    });
    chips.addEventListener('click',function(e){ var b=e.target.closest('button[data-lg]'); if(b) filter(b.getAttribute('data-lg')); });
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    show(m ? m[1] : (n.today ? 'today' : 'tomorrow'), false);
    return true;
  }
  window.addEventListener('popstate',function(){
    if(host==null) return;
    var m=location.search.match(/[?&]tab=([a-z]+)/); show(m ? m[1] : 'today', false);
  });
  var k=0;
  (function wait(){
    k++;
    if(build() || k>40){ document.documentElement.classList.add('pvx-ready'); return; }
    setTimeout(wait,120);
  })();
})();
