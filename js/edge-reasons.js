/* EDGEREASONS_20261019: same audit-backed reasons as the Telegram/Discord cards. */
(function(){
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function rank(x){var r=(x&&x.reasons)||x||{};return{proven:r.proven||[],support:r.support||[],watch:r.watch||[]};}
function li(x,c){return '<li class="'+c+'"><span>'+esc(x.t)+(x.d?' <span class="er-det">('+esc(x.d)+')</span>':'')+'</span></li>';}
function css(){if(document.getElementById('er-css'))return;var st=document.createElement('style');st.id='er-css';st.textContent=
  '.er-box{margin-top:4px}.er-sig{display:inline-flex;gap:10px;font-size:.72rem;font-weight:700;color:var(--text-dim,#94a3b8);background:var(--bg-elev,rgba(148,163,184,.08));border-radius:999px;padding:5px 12px;margin-bottom:6px}'+
  '.er-title{font-size:.66rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim,#94a3b8);margin:12px 0 6px}'+
  '.er-list{list-style:none;margin:0;padding:0;display:grid;gap:6px}.er-list li{display:flex;gap:9px;align-items:flex-start;font-size:.84rem;line-height:1.4;padding:8px 11px;border-radius:9px;background:var(--bg-elev,rgba(148,163,184,.08))}'+
  '.er-list li:before{content:"";flex:0 0 7px;height:7px;margin-top:6px;border-radius:50%;background:var(--accent,#a3e635)}.er-list li.er-s:before{background:#C9A24B}.er-list li.er-w:before{background:var(--warn,#f59e0b)}'+
  '.er-det{color:var(--text-dim,#94a3b8)}.er-note{font-size:.66rem;color:var(--text-dim,#94a3b8);margin-top:10px}';document.head.appendChild(st);}
window.nmwReasons=rank;
window.nmwReasonsHtml=function(t){try{var R=rank(t);var main=R.proven.length?R.proven:R.support.slice(0,3);
  var rest=R.proven.length?R.support:R.support.slice(3);if(!main.length&&!R.watch.length)return '';css();
  var sig=[];if(R.proven.length)sig.push('\u2705 '+R.proven.length+' proven');if(R.support.length)sig.push('\u2795 '+R.support.length+' supporting');
  var h='<div class="er-box">'+(sig.length?'<div class="er-sig">'+sig.join('<span>\u00b7</span>')+'</div>':'');
  if(main.length)h+='<div class="er-title">Why this pick</div><ul class="er-list">'+main.slice(0,4).map(function(x){return li(x,R.proven.length?'er-p':'er-s');}).join('')+'</ul>';
  if(rest.length)h+='<div class="er-title">Also in its favour</div><ul class="er-list">'+rest.slice(0,3).map(function(x){return li(x,'er-s');}).join('')+'</ul>';
  if(R.watch.length)h+='<div class="er-title">Watch-outs</div><ul class="er-list">'+R.watch.slice(0,2).map(function(x){return li(x,'er-w');}).join('')+'</ul>';
  return h+'<div class="er-note">Reasons ranked by what our published record shows actually beats the bookmaker price.</div></div>';}catch(e){return '';}};
})();
/* SIGPILL_20261019: signals pill replacing the old x/6 score bar on tip cards. */
(function(){
  window.nmwSignalsHtml=function(t){try{
    if(!window.nmwReasons)return '';var R=window.nmwReasons(t);
    var p=R.proven.length,s=R.support.length;if(!p&&!s)return '';
    if(!document.getElementById('er-sig-css')){var st=document.createElement('style');st.id='er-sig-css';
      st.textContent='.er-sigrow{display:inline-flex;gap:8px;align-items:center;margin-top:8px;font-size:.72rem;font-weight:700;color:var(--text-muted,#9CA3A0);background:var(--bg-elev,rgba(148,163,184,.08));border:1px solid var(--border,rgba(255,255,255,.06));border-radius:999px;padding:4px 11px}.er-sigrow b{color:var(--accent,#3DDC84)}';
      document.head.appendChild(st);}
    var bits=[];if(p)bits.push('\u2705 <b>'+p+'</b> proven');if(s)bits.push('\u2795 '+s+' supporting');
    return '<div class="er-sigrow" title="Checks that passed for this pick">'+bits.join(' \u00b7 ')+'</div>';
  }catch(e){return '';}};
})();
/* INTERLINK_20261019: "Match preview" link on tip cards that have a FootballIQ preview. */
(function(){
  var map=null;
  function css(){if(document.getElementById('er-prev-css'))return;var st=document.createElement('style');st.id='er-prev-css';
    st.textContent='.er-prev{display:inline-block;margin:8px 0 2px;font-size:.74rem;font-weight:700;color:var(--accent,#3DDC84);text-decoration:none}.er-prev:hover{text-decoration:underline}';document.head.appendChild(st);}
  function apply(){if(!map)return;var els=document.querySelectorAll('[data-abid]');
    for(var i=0;i<els.length;i++){var el=els[i],p=map[el.getAttribute('data-abid')],pr=el.previousElementSibling;
      if(!p||(pr&&pr.className==='er-prev'))continue;
      var a=document.createElement('a');a.className='er-prev';a.href=p;a.textContent='Match preview \u203A';
      a.addEventListener('click',function(e){e.stopPropagation();});el.parentNode.insertBefore(a,el);}}
  try{fetch('/data/tip_previews.json?t='+Math.floor(Date.now()/600000)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d)return;map=d;css();apply();new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});}).catch(function(){});}catch(e){}
})();

/* TIP_PLAIN_20261025: plain-English sentences first (from /data/tip_plain.json). Off where the homepage pop-up adds its own. */
(function () {
  if (!window.nmwReasonsHtml || window.__nmwRP) return; window.__nmwRP = 1;
  var orig = window.nmwReasonsHtml;
  function e(x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  try { fetch('/data/tip_plain.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) { window.__nmwTP = window.__nmwTP || d; }).catch(function () {}); } catch (x) {}
  window.nmwReasonsHtml = function (t) {
    var h = orig.apply(this, arguments); if (window.__nmwTS) return h;
    var p = window.__nmwTP && t && window.__nmwTP[String(t.id)];
    return (p && p.all ? '<p class="er-plain" style="font-size:.9rem;line-height:1.5;margin:4px 0 8px">' + e(p.all.join(' ')) + '</p>' : '') + h;
  };
})();

/* LANE_20261117: one place that decides a tip's lane and how the card words it. */
(function(){
  function e(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var PAUSED={OVER25:'Over 2.5 tips paused since 13 Nov after losing money. This market no longer fires.'};
  var FOOT={priced:'Reasons ranked by what our record shows beats the bookmaker price.',
    botd:'Reasons ranked by what our record shows beats the bookmaker price.',
    record:'No bookmaker price when this fired, so it\u2019s tracked for win/loss only and never staked or counted in ROI.',
    trial:'Trial league: tracked for win/loss only while we test new leagues. Never staked or counted in ROI.'};
  var CHIP={priced:['\uD83D\uDCB7 Priced tip','Staked at the price shown. Counts in ROI.'],
    botd:['\u2B50 Bet of the Day \u00b7 priced','Our top priced pick of the day. Counts in ROI.'],
    record:['\uD83D\uDCDD Record-only','No bookmaker price when it fired. Win/loss tracked, never staked, not in ROI.'],
    trial:['\uD83E\uDDEA Trial league \u00b7 record-only','New league on trial. Win/loss tracked, never staked, not in ROI.']};
  function css(){if(document.getElementById('ln-css'))return;var s=document.createElement('style');s.id='ln-css';
    s.textContent='.ln-chip{display:inline-block;font-size:.68rem;font-weight:800;padding:2px 8px;border-radius:999px;margin-right:6px;border:1px solid currentColor;vertical-align:middle}'
    +'.ln-priced,.ln-botd{color:var(--accent,#3DDC84)}.ln-record{color:#94a3b8}.ln-trial{color:#c084fc}'
    +'.ln-why{margin:10px 0 4px;padding:10px 12px;border-radius:10px;background:var(--bg-elev,rgba(148,163,184,.08));border-left:3px solid var(--accent,#3DDC84);font-size:.82rem;line-height:1.5}'
    +'.ln-why b{display:block;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim,#94a3b8);margin-bottom:4px}'
    +'.ln-sys{font-size:.72rem;color:var(--warn,#f59e0b);margin-top:6px}';document.head.appendChild(s);}
  function pick(t){return t.market==='HOME_WIN'?t.home:t.market==='AWAY_WIN'?t.away:t.market==='DRAW'?'the draw':(t.market_label||'this pick');}
  function pct(x){if(x==null||x==='')return null;x=+x;return isFinite(x)?(x>1?x:x*100):null;}
  window.nmwLane=function(t){try{css();t=t||{};
    var botd=t.is_bet_of_day===true||!!(window._botdIds&&window._botdIds[t.id]);
    var trial=t.scanner_src==='trial', priced=!trial&&!!t.odds&&t.odds_source!=='stats_unpriced';
    var k=trial?'trial':(priced?(botd?'botd':'priced'):'record'), c=CHIP[k];
    var chip='<span class="ln-chip ln-'+k+'" title="'+e(c[1])+'">'+c[0]+'</span>';
    var price='<span class="tip-odds">'+(priced?'@ '+(+t.odds).toFixed(2):'no price')+'</span>';
    var why='', mp=pct(t.model_prob);
    if(priced&&mp!=null){var ip=pct(t.implied_prob);if(ip==null)ip=100/t.odds;var gap=mp-ip,who=e(pick(t));
      if(gap>0)why='<div class="ln-why"><b>Why the price</b>The bookmaker\u2019s '+(+t.odds).toFixed(2)+' gives '+who+' about a '+ip.toFixed(1)+'% chance. Our model makes it '+mp.toFixed(1)+'%. That '+gap.toFixed(1)+'-point gap is the edge.'
        +(t.odds>=3?' We\u2019re not saying '+who+' will win, only that the price is bigger than it should be.':' The price pays more than the true chance suggests.')+'</div>';}
    var sys=PAUSED[t.market]?'<div class="ln-sys">\u23F8 '+PAUSED[t.market]+'</div>':'';
    return {kind:k,chip:chip,meta:chip+price,why:why,sys:sys,foot:FOOT[k]};
  }catch(x){return {kind:'',chip:'',meta:'',why:'',sys:'',foot:''};}};
  var NOTE='Reasons ranked by what our published record shows actually beats the bookmaker price.';
  if(window.nmwReasonsHtml){var o=window.nmwReasonsHtml;window.nmwReasonsHtml=function(t){var h=o.apply(this,arguments);if(!h)return h;h=h.replace(/<div class="er-sig">[\s\S]*?<\/div>/,'');/*PILL1_20261117: header pill only*/var f=window.nmwLane(t).foot;return f?h.split(NOTE).join(f):h;};}
})();
