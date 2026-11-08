/* 90minWaffle Search v5 - server search (/search/), keeps the v4 hooks (.gs-trigger, data-search, __gsOpen, openSearch). SEARCH_V5_20261107 */
(function(){
"use strict";
if(window.__nmwsInit)return;window.__nmwsInit=1;window.__nmwsCounts=window.__nmwsCounts||{};
var API="/search/",RECENT="nmw_search_recent_v5";
var TYPES=[["all","All"],["player","Players"],["club","Clubs"],["national_team","Nations"],["fixture","Matches"],["tool","Tools"]];
var TOOLS=[["StatIQ record","/edges/"],["Trends","/footballiq/trends/"],["Season sims","/footballiq/sims/"],["Form table","/footballiq/form/"],["Champions League","/tournaments/ucl/"],["Corrections","/corrections/"]];
var LABEL={player:"Player",club:"Club",national_team:"Nation",fixture:"Match",tool:"Tool",edge:"Tip",analysis:"Analysis"};
var PLURAL={player:"Players",club:"Clubs",national_team:"Nations",fixture:"Matches",tool:"Tools",edge:"Tips",analysis:"Analysis"};
var _ov=null,_in=null,_res=null,_pills=null,_type="all",_sel=-1,_items=[],_timer=null,_seq=0,_open=false;
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function getRecent(){try{return JSON.parse(localStorage.getItem(RECENT)||"[]")||[];}catch(e){return [];}}
function addRecent(q){if(q.length<2)return;try{var r=getRecent().filter(function(x){return x.toLowerCase()===q.toLowerCase()?false:true;});r.unshift(q);localStorage.setItem(RECENT,JSON.stringify(r.slice(0,6)));}catch(e){}}
function css(){
 if(document.getElementById("nmws-css"))return;
 var s=document.createElement("style");s.id="nmws-css";
 s.textContent=["#nmws-overlay{position:fixed;inset:0;z-index:99999;background:rgba(5,10,24,.86);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;padding:6vh 12px 12px}",
 "#nmws-overlay.on{display:flex}",
 ".nmws-box{width:100%;max-width:640px;background:#0d1730;border:1px solid rgba(34,211,238,.35);border-radius:14px;box-shadow:0 0 30px rgba(34,211,238,.15);overflow:hidden;display:flex;flex-direction:column;max-height:84vh}",
 ".nmws-top{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}",
 "#nmws-input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#e6f1ff;font-size:16px}",
 "#nmws-close{background:transparent;border:1px solid rgba(255,255,255,.15);color:#9fb3c8;border-radius:8px;padding:4px 8px;cursor:pointer;font-size:.8rem}",
 "#nmws-pills{display:flex;gap:6px;padding:8px 14px;overflow-x:auto;border-bottom:1px solid rgba(255,255,255,.06)}",
 ".nmws-pill{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#9fb3c8;border-radius:999px;padding:4px 10px;font-size:.78rem;white-space:nowrap;cursor:pointer}",
 ".nmws-pill.on{background:rgba(34,211,238,.15);border-color:#22d3ee;color:#22d3ee}",
 "#nmws-results{overflow-y:auto;padding:6px 0;-webkit-overflow-scrolling:touch}",
 ".nmws-h{padding:8px 14px 4px;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:#22d3ee}",
 ".nmws-item{display:flex;gap:10px;align-items:center;padding:9px 14px;color:#e6f1ff;text-decoration:none;cursor:pointer}",
 ".nmws-item.sel,.nmws-item:hover{background:rgba(34,211,238,.08)}",
 ".nmws-tag{flex:none;font-size:.62rem;color:#9fb3c8;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:2px 6px;min-width:46px;text-align:center}",
 ".nmws-main{min-width:0;flex:1}",
 ".nmws-name{font-weight:700;font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
 ".nmws-sub{font-size:.75rem;color:#9fb3c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
 ".nmws-stats{font-size:.72rem;color:#22d3ee;margin-top:2px}",
 ".nmws-chips{display:flex;flex-wrap:wrap;gap:6px;padding:4px 14px 10px}",
 ".nmws-chip{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#e6f1ff;border-radius:999px;padding:5px 11px;font-size:.8rem;cursor:pointer;text-decoration:none}",
 ".nmws-empty{padding:18px 14px;color:#9fb3c8;font-size:.85rem;line-height:1.5}",
 "#nmws-foot{padding:7px 14px;font-size:.66rem;color:#6b7f96;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;gap:8px}",
 "@media (max-width:600px){#nmws-overlay{padding:0}.nmws-box{max-width:none;max-height:100vh;height:100%;border-radius:0;border:0}}"].join("");
 document.head.appendChild(s);
}
var _lt=null;function logq(){var q=_in.value.trim();if(q.length>=2){fetch(API+"?q="+encodeURIComponent(q)+"&n=1&log=1").catch(function(){});}}
function build(){
 css();
 var old=document.getElementById("nmws-overlay");if(old)old.parentNode.removeChild(old);
 _ov=document.createElement("div");_ov.id="nmws-overlay";_ov.setAttribute("role","dialog");_ov.setAttribute("aria-label","Search 90minWaffle");
 _ov.innerHTML='<div class="nmws-box"><div class="nmws-top"><input id="nmws-input" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search players, clubs, nations, tools\u2026" aria-label="Search"><button id="nmws-close" type="button" aria-label="Close search">Esc</button></div><div id="nmws-pills"></div><div id="nmws-results"></div><div id="nmws-foot"><span>Every stat labelled with its season</span><span id="nmws-at"></span></div></div>';
 document.body.appendChild(_ov);
 _in=document.getElementById("nmws-input");_res=document.getElementById("nmws-results");_pills=document.getElementById("nmws-pills");
 _in.addEventListener("input",function(){clearTimeout(_timer);_timer=setTimeout(run,120);clearTimeout(_lt);_lt=setTimeout(logq,1500);});
 _in.addEventListener("keydown",key);
 document.getElementById("nmws-close").addEventListener("click",close);
 _ov.addEventListener("click",function(e){if(e.target===_ov)close();});
 pills();
}
function pills(){
 _pills.innerHTML=TYPES.map(function(t){return '<span class="nmws-pill'+(t[0]===_type?' on':'')+'" data-t="'+t[0]+'">'+t[1]+'</span>';}).join("");
 [].forEach.call(_pills.querySelectorAll(".nmws-pill"),function(p){p.addEventListener("click",function(){_type=p.getAttribute("data-t");pills();run();_in.focus();});});
}
function row(r){
 return '<a class="nmws-item" href="'+esc(r.url)+'"><span class="nmws-tag">'+esc(LABEL[r.type]||r.type)+'</span><span class="nmws-main"><div class="nmws-name">'+esc(r.name)+'</div>'+(r.sub?'<div class="nmws-sub">'+esc(r.sub)+'</div>':'')+(r.stats?'<div class="nmws-stats">'+esc(r.stats)+'</div>':'')+'</span></a>';
}
function foot(d){var e=document.getElementById("nmws-at");if(e&&d&&d.index_at){var t=new Date(d.index_at);e.textContent="Index updated "+t.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});}}
function home(){
 _items=[];_sel=-1;var rec=getRecent(),h="";
 if(rec.length){h+='<div class="nmws-h">Recent searches</div><div class="nmws-chips">'+rec.map(function(x){return '<span class="nmws-chip" data-q="'+esc(x)+'">'+esc(x)+'</span>';}).join("")+'</div>';}
 h+='<div class="nmws-h">Jump to</div><div class="nmws-chips">'+TOOLS.map(function(t){return '<a class="nmws-chip" href="'+t[1]+'">'+esc(t[0])+'</a>';}).join("")+'</div>';
 h+='<div class="nmws-h">Try searching</div><div class="nmws-chips">'+["Haaland","Arsenal","Spurs","Mbappe","Spain","StatIQ record"].map(function(x){return '<span class="nmws-chip" data-q="'+esc(x)+'">'+esc(x)+'</span>';}).join("")+'</div>';
 _res.innerHTML=h;
 [].forEach.call(_res.querySelectorAll("[data-q]"),function(c){c.addEventListener("click",function(){_in.value=c.getAttribute("data-q");run();_in.focus();});});
}
function run(){
 var q=_in.value.trim();
 if(q.length<2){home();return;}
 var my=++_seq,u=API+"?q="+encodeURIComponent(q)+"&n=12"+(_type==="all"?"":"&type="+encodeURIComponent(_type));
 fetch(u).then(function(r){return r.json();}).then(function(d){if(my===_seq)show(d,q);}).catch(function(){if(my===_seq)_res.innerHTML='<div class="nmws-empty">Search is unavailable for a moment. Please try again shortly.</div>';});
}
function show(d,q){
 var R=d.results||[];_items=[];_sel=-1;foot(d);
 if(R.length===0){_res.innerHTML='<div class="nmws-empty">No results for \u201c'+esc(q)+'\u201d. Try a surname, a club nickname (Spurs, Barca) or a tool (StatIQ, sims).</div>';return;}
 var order=[],groups={};
 R.forEach(function(r){var t=r.type||"other";if(groups[t]===undefined){groups[t]=[];order.push(t);}groups[t].push(r);});
 var h="";
 order.forEach(function(t){h+='<div class="nmws-h">'+esc(groups[t].length>1?(PLURAL[t]||t):(LABEL[t]||t))+'</div>';groups[t].forEach(function(r){h+=row(r);});});
 _res.innerHTML=h;_items=[].slice.call(_res.querySelectorAll(".nmws-item"));
 _items.forEach(function(a){a.addEventListener("click",function(){addRecent(q);});});
}
function key(e){
 if(e.key==="Escape"){close();return;}
 if(e.key==="ArrowDown"||e.key==="ArrowUp"){
  if(_items.length===0)return;e.preventDefault();
  _sel=e.key==="ArrowDown"?Math.min(_items.length-1,_sel+1):Math.max(0,_sel-1);
  _items.forEach(function(a,i){a.classList.toggle("sel",i===_sel);});_items[_sel].scrollIntoView({block:"nearest"});return;
 }
 if(e.key==="Enter"){var a=_items[_sel>=0?_sel:0];if(a){e.preventDefault();addRecent(_in.value.trim());location.href=a.getAttribute("href");}}
}
function open(q){
 if(_ov===null)build();
 _ov.classList.add("on");_open=true;document.documentElement.style.overflow="hidden";
 _in.value=(typeof q==="string")?q:"";if(_in.value)run();else home();
 setTimeout(function(){_in.focus();},30);
}
function close(){if(_ov)_ov.classList.remove("on");_open=false;document.documentElement.style.overflow="";}
window.__gsOpen=open;window.__gsClose=close;window.openSearch=open;
function floatBtn(){ /* FLOAT_BTN_20261107: pages without a search button get a small floating one */
 if(document.querySelector(".gs-trigger,[data-search]"))return;
 var b=document.createElement("button");b.type="button";b.className="gs-trigger";b.setAttribute("aria-label","Search");
 b.style.cssText="position:fixed;right:16px;bottom:84px;z-index:9999;width:46px;height:46px;border-radius:50%;background:#0d1730;border:1px solid rgba(34,211,238,.6);box-shadow:0 0 14px rgba(34,211,238,.35);cursor:pointer;display:flex;align-items:center;justify-content:center";
 b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22d3ee" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
 document.body.appendChild(b);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",floatBtn);else floatBtn();
document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest(".gs-trigger,[data-search]"):null;if(t){e.preventDefault();open();}},true);
document.addEventListener("keydown",function(e){
 if(e.key==="/"&&_open===false){var a=document.activeElement,tg=a?a.tagName:"";if(tg==="INPUT"||tg==="TEXTAREA"||(a&&a.isContentEditable))return;e.preventDefault();open();}
 else if(e.key==="Escape"&&_open)close();
});
})();
