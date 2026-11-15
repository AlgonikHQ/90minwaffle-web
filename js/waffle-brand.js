/* WAFFLE_BRAND_20261112 */
(function(){
var D=document.documentElement,MQ=window.matchMedia?matchMedia("(prefers-color-scheme: dark)"):null;
var ACC=[["gold","#C9A24B","Gold"],["cyan","#22D3EE","Cyan"],["green","#2DBE6C","Green"],["orange","#F97316","Orange"],["purple","#8B5CF6","Purple"]];
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function put(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function mode(){var m=get("theme");return(m==="dark"||m==="auto")?m:"light"}
function want(){var m=mode();return m==="auto"?(MQ&&MQ.matches?"dark":"light"):m}
function apply(){var m=mode(),r=want();if(D.getAttribute("data-theme")!==r)D.setAttribute("data-theme",r);if(D.getAttribute("data-mode")!==m)D.setAttribute("data-mode",m);
var a=get("nmw_accent");if(/^(cyan|green|orange|purple)$/.test(a||""))D.setAttribute("data-accent",a);else D.removeAttribute("data-accent");
var t=document.querySelector('meta[name="theme-color"]');if(t)t.setAttribute("content",r==="dark"?"#0B0B0C":"#FAFAF7")}
function set(m,a){if(m)put("theme",m);if(a!==undefined)put("nmw_accent",a==="gold"?null:a);apply();paint()}
window.NMWTheme={set:set,apply:apply};
if(MQ&&MQ.addEventListener)MQ.addEventListener("change",function(){if(mode()==="auto")apply()});
window.addEventListener("storage",function(e){if(e.key==="theme"||e.key==="nmw_accent")apply()});
var card=null;
function btn(label,pressed,fn,sw){var b=document.createElement("button");b.type="button";b.className="wb-btn";b.setAttribute("aria-pressed",pressed?"true":"false");if(sw){var i=document.createElement("i");i.style.background=sw;b.appendChild(i)}b.appendChild(document.createTextNode(label));b.onclick=fn;return b}
function paint(){if(!card)return;var m=mode(),a=get("nmw_accent")||"gold";card.innerHTML="";
var h=document.createElement("h3");h.textContent="Appearance";card.appendChild(h);
var p=document.createElement("p");p.textContent="Choose how the site looks on this device.";card.appendChild(p);
var l1=document.createElement("span");l1.className="wb-lab";l1.textContent="Mode";card.appendChild(l1);
var r1=document.createElement("div");r1.className="wb-row";[["light","Light"],["dark","Dark"],["auto","Auto"]].forEach(function(x){r1.appendChild(btn(x[1],m===x[0],function(){set(x[0])}))});card.appendChild(r1);
var l2=document.createElement("span");l2.className="wb-lab";l2.textContent="Accent colour";card.appendChild(l2);
var r2=document.createElement("div");r2.className="wb-row";ACC.forEach(function(x){r2.appendChild(btn(x[2],a===x[0],function(){set(null,x[0])},x[1]))});card.appendChild(r2)}
function txt(e){return(e.textContent||"").replace(/\s+/g," ").trim()}
function findEl(re){var c=document.querySelectorAll("button,a,summary,h2,h3,h4,label,li,div,span,p"),best=null,n=1e9;
for(var i=0;i<c.length;i++){var e=c[i];if(e===card||(card&&card.contains(e)))continue;var t=txt(e);if(t.length<2||t.length>70||!re.test(t))continue;var k=e.getElementsByTagName("*").length;if(k<n){n=k;best=e}}return best}
function lca(a,b){var x=a;while(x&&!x.contains(b))x=x.parentNode;return x}
function target(){var rs=findEl(/restore\s+from\s+code/i),rp=findEl(/reset\s+profile/i);
if(rs&&rp&&rs!==rp){var A=lca(rs,rp);if(!A)return null;if(A.children.length<=2&&A.parentNode&&A!==document.body){return{p:A.parentNode,r:A}}var r=rp;while(r.parentNode!==A)r=r.parentNode;return{p:A,r:r}}
if(rp){var q=rp;while(q.parentNode&&q.parentNode!==document.body&&txt(q.parentNode).length<220)q=q.parentNode;return{p:q.parentNode,r:q}}
if(rs){var s=rs;while(s.parentNode&&s.parentNode!==document.body&&txt(s.parentNode).length<220)s=s.parentNode;return{p:s.parentNode,r:s}}
return null}
var busy=false;
function sync(){if(busy)return;busy=true;try{
if(!/^\/me(\/|$)/.test(location.pathname)){if(card&&card.parentNode)card.parentNode.removeChild(card);return}
var t=target();
if(!t){if(card&&card.parentNode)card.parentNode.removeChild(card);return}
if(!card){card=document.createElement("section");card.id="wb-appearance";card.className="wb-card wb-in";paint()}
if(card.parentNode!==t.p||card.nextSibling!==t.r)t.p.insertBefore(card,t.r)
}finally{busy=false}}
var pend=false;
function later(){if(pend)return;pend=true;(window.requestAnimationFrame||setTimeout)(function(){pend=false;sync()})}
function mount(){sync();try{new MutationObserver(later).observe(document.body,{childList:true,subtree:true})}catch(e){}}
function killOld(){try{window.toggleTheme=function(){};document.querySelectorAll(".setting-row").forEach(function(r){var l=r.querySelector(".setting-label");if(l&&/^theme$/i.test(l.textContent.trim()))r.parentNode.removeChild(r)});document.querySelectorAll(".theme-toggle").forEach(function(b){b.style.display="none"})}catch(e){}}
try{new MutationObserver(function(){if(D.getAttribute("data-theme")!==want())apply()}).observe(D,{attributes:true,attributeFilter:["data-theme"]})}catch(e){}
function watchOld(){killOld();try{var mo=new MutationObserver(killOld);mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();killOld()},20000)}catch(e){}}
apply();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watchOld);else watchOld();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();

/* WB_RT_V5: runtime remap of any colours the build-time pass missed (JS-injected CSS, other stylesheets, inline styles) */
(function(){
if(window.__wbrt)return;window.__wbrt=1;
var COL=/(#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-]))|(rgba?\(\s*[\d.]+\s*[, ]\s*[\d.]+\s*[, ]\s*[\d.]+\s*(?:[,\/]\s*[\d.]+%?\s*)?\))|(^|[^\w#-])(white|black)(?![\w-])/gi;
var MASK=/url\((?:[^()]|\([^()]*\))*\)|var\((?:[^()]|\([^()]*\))*\)|"[^"]*"|'[^']*'/gi;
var RGBF=/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,\/]\s*([\d.]+%?)\s*)?\)/i;
var KEEP=/(?:^|[^a-z0-9])(win|won|wins|profit|pos|positive|up|good|success|roi|gain|correct|hit|green|w|ok|pass|passed)(?:$|[^a-z0-9])/i;
var OVER=/overlay|scrim|mask|shade|photo|img|image|cover|banner|backdrop/i;
var ACC=/var\(--(?:accent|cy|a-fill|brand|primary|accent-cyan)/;
function parse(t){t=t.toLowerCase();if(t==="white")return[255,255,255,1];if(t==="black")return[0,0,0,1];
if(t.charAt(0)==="#"){var h=t.slice(1);if(h.length===3||h.length===4)h=h.replace(/./g,function(c){return c+c});
return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length===8?parseInt(h.slice(6,8),16)/255:1]}
var m=RGBF.exec(t);if(!m)return null;var a=m[4];a=a==null?1:(/%$/.test(a)?parseFloat(a)/100:parseFloat(a));return[+m[1],+m[2],+m[3],a]}
function hls(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,h=0,s=0;
if(mx!==mn){var d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);if(mx===r)h=(g-b)/d+(g<b?6:0);else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60}return[h,l,s]}
function fa(a){return String(Math.round(a*100)/100)}
function hx(r,g,b){return"#"+[r,g,b].map(function(x){x=Math.round(x);return(x<16?"0":"")+x.toString(16)}).join("")}
function mapc(tok,kind,keepg,over){var p=parse(tok);if(!p)return null;var r=p[0],g=p[1],b=p[2],a=p[3],q=hls(r,g,b),h=q[0],l=q[1],s=q[2];
var H=hx(r,g,b),RG=Math.round(r)+" "+Math.round(g)+" "+Math.round(b);
if(s>=.4&&l>=.32&&l<=.92&&((h>=165&&h<=238)||(h>=108&&h<165&&!keepg&&l<=.78))){
if(a<.999)return"rgb(var(--a-rgb,"+RG+") / "+fa(a)+")";
return(kind==="bg"||kind==="bd")?"var(--a-fill,"+H+")":"var(--a-text,"+H+")"}
if(!(s<.18||(h>=190&&h<=275&&(s<.65||l<.3||l>.9)))||kind==="sh")return null;
var k=kind;if(k==="gen")k=l<.3?"bg":(l>.55?"fg":null);
if(k==="bg"){if(a>=.95){var B=[[.075,"s0"],[.125,"s1"],[.19,"s2"],[.3,"s3"]];for(var i=0;i<B.length;i++)if(l<B[i][0])return"var(--"+B[i][1]+","+H+")";return null}
if(over)return null;if(l<.3)return"rgb(var(--"+(l<.1?"s0":"s1")+"-rgb,"+RG+") / "+fa(a)+")";if(l>.9)return"rgb(var(--ov-rgb,"+RG+") / "+fa(a)+")";return null}
if(k==="bd"){if(a>=.95)return l<.42?"var(--s3,"+H+")":null;if(l>.8)return"rgb(var(--ov-rgb,"+RG+") / "+fa(a)+")";if(l<.3)return"rgb(var(--s3-rgb,"+RG+") / "+fa(a)+")";return null}
if(k==="fg"){var t=l>.85?"t0":l>.62?"t1":l>.42?"t2":null;if(!t)return null;if(a>=.95)return"var(--"+t+","+H+")";return"rgb(var(--"+t+"-rgb,"+RG+") / "+fa(a)+")"}
return null}
function kindOf(p){p=p.toLowerCase();
if(p.indexOf("--")===0){if(/border|line|divider|sep|stroke|rule/.test(p))return"bd";if(/bg|back|surface|card|elev|panel|chip|pill|tile|base/.test(p))return"bg";if(/text|txt|mut|dim|ink|fg|font|label|fore|tone/.test(p))return"fg";return"gen"}
if(p.indexOf("background")===0||p==="stop-color"||p==="flood-color")return"bg";
if(p.indexOf("border")===0||p.indexOf("outline")===0||p==="column-rule")return"bd";
if(/^(color|fill|stroke|caret-color|text-decoration-color|-webkit-text-fill-color)$/.test(p))return"fg";return"sh"}
function sub(val,kind,keepg,over){var ph=[],sat=false;
var v=val.replace(MASK,function(m){ph.push(m);return"\u0000"+(ph.length-1)+"\u0000"});
v=v.replace(COL,function(m,hex,rgb,pre,word){var t=hex||rgb||word,lead=pre||"";var r=null;try{r=mapc(t,kind,keepg,over)}catch(e){}
if(r===null){try{var p=parse(t);if(p&&hls(p[0],p[1],p[2])[2]>=.4)sat=true}catch(e){}return m}return lead+r});
v=v.replace(/\u0000(\d+)\u0000/g,function(m,i){return ph[+i]});return[v,sat]}
function block(st,sel,inline){var keepg=inline||KEEP.test(sel),over=OVER.test(sel),n=st.length,names=[],i;
for(i=0;i<n;i++)names.push(st[i]);
var accbg=false,sat=false,photo=false,fg=[];
for(i=0;i<names.length;i++){var p=names[i],v=st.getPropertyValue(p);if(!v||/^--(s[0-3]|t[0-2]|a-|ov|on-accent)/.test(p))continue;var k=kindOf(p);
if(k==="fg"&&p.indexOf("--")!==0){fg.push(p);continue}
var r=sub(v,k,keepg,over),nv=r[0];
if(k==="bg"){if(nv.indexOf("var(--a-fill")>=0||ACC.test(v))accbg=true;if(r[1])sat=true;if(/url\(/.test(v)&&!/svg/i.test(v))photo=true}
if(nv!==v)st.setProperty(p,nv,st.getPropertyPriority(p))}
for(i=0;i<fg.length;i++){var q=fg[i],w=st.getPropertyValue(q);if(!w)continue;var out;
if(accbg&&q==="color"&&(w.match(COL)||[]).length===1&&w.indexOf("var(")<0)out="var(--on-accent,#0B0B0C)";
else if(sat||photo)out=w;else out=sub(w,"fg",keepg,over)[0];
if(out!==w)st.setProperty(q,out,st.getPropertyPriority(q))}}
function rules(list){for(var i=0;i<list.length;i++){var r=list[i];try{
if(r.style&&(r.type===1||r.type===8))block(r.style,r.selectorText||"",false);
if(r.cssRules&&r.cssRules.length&&r.type!==5)rules(r.cssRules)}catch(e){}}}
var seen=new WeakMap();
function sheets(){var ss=document.styleSheets;for(var i=0;i<ss.length;i++){var s=ss[i],list;
try{if(s.href&&/waffle-brand/.test(s.href))continue;if(s.ownerNode&&s.ownerNode.getAttribute&&s.ownerNode.getAttribute("data-wb"))continue;list=s.cssRules}catch(e){continue}
if(!list)continue;if(seen.get(s)===list.length)continue;rules(list);seen.set(s,list.length)}}
function inl1(el){try{if(el.closest&&el.closest("#wb-appearance"))return;var a=el.getAttribute("style");if(!a||!/#[0-9a-f]{3}|rgb|white|black/i.test(a))return;block(el.style,"",true)}catch(e){}}
function inl(root){if(root.nodeType!==1)return;inl1(root);var l=root.querySelectorAll?root.querySelectorAll("[style]"):[];for(var i=0;i<l.length;i++)inl1(l[i])}
var q=[],sp=false,ip=false;
function flush(){ip=false;sheets();var a=q;q=[];for(var i=0;i<a.length;i++)inl(a[i])}
function sched(){if(ip)return;ip=true;(window.requestAnimationFrame||setTimeout)(flush)}
function run(){sheets();inl(document.documentElement)}
function start(){run();try{new MutationObserver(function(ms){var need=false;for(var i=0;i<ms.length;i++){var m=ms[i];
if(m.type==="attributes"){q.push(m.target);need=true;continue}
for(var j=0;j<m.addedNodes.length;j++){var n=m.addedNodes[j];if(n.nodeType!==1)continue;q.push(n);need=true}}
if(need)sched()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["style"]})}catch(e){}}
try{var pre=document.createElement("style");pre.setAttribute("data-wb","1");pre.textContent="html.wb-pre *,html.wb-pre *::before,html.wb-pre *::after{transition:none!important;animation-duration:0s!important}";document.documentElement.appendChild(pre);document.documentElement.classList.add("wb-pre")}catch(e){}
start();
document.addEventListener("DOMContentLoaded",run);
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="LINK")run()},true);
window.addEventListener("load",function(){run();setTimeout(function(){run();document.documentElement.classList.remove("wb-pre")},600)});
})();
