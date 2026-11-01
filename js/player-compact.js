/* PLX1: player pages - hero on top, tabs Overview / Matches / Career / Traits / FAQs, more-players chips */
(function(){
  var IMP=' '+String.fromCharCode(33)+'important';
  var MAP=[[/this season|profile/i,'overview'],[/recent matches/i,'matches'],[/club career|career/i,'career'],[/trait/i,'traits'],[/faq/i,'faqs']];
  var TABS=[['overview','Overview'],['matches','Matches'],['career','Career'],['traits','Traits'],['faqs','FAQs']];
  var cards=[], links={}, nav=null, P=location.pathname;
  function txt(e){ return (e.textContent||'').replace(/\s+/g,' ').trim(); }
  function head(c){ var h=c.querySelector('h2') || c.querySelector('summary'); return h ? txt(h) : ''; }
  function css(){
    var s=document.createElement('style');
    s.textContent='.plx-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:14px 0;padding:2px 0 4px}.plx-tabs::-webkit-scrollbar{display:none}'+
      '.plx-tabs a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;border:1px solid #1e3157;color:#c5d2e8'+IMP+';font-weight:600;font-size:14px;text-decoration:none'+IMP+';white-space:nowrap}'+
      '.plx-tabs a.on{background:#22d3ee;color:#04222a'+IMP+';border-color:#22d3ee;font-weight:700}.plx-tabs a:focus-visible,.plx-more a:focus-visible{outline:2px solid #22d3ee;outline-offset:2px}'+
      '.plx-off{display:none'+IMP+'}.plx-full{grid-column:1/-1'+IMP+';max-width:none'+IMP+';width:auto'+IMP+'}.plx-full *{max-width:100%}'+
      '.plx-more{margin:0 0 14px}.plx-more small{display:block;color:#9fb0cc;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}'+
      '.plx-more div{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.plx-more div::-webkit-scrollbar{display:none}'+
      '.plx-more a{flex:none;min-height:36px;display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid #1e3157;background:#111f3a;color:#e6edf7'+IMP+';text-decoration:none'+IMP+';font-size:13px;font-weight:600;white-space:nowrap}'+
      '.plx-more a:hover{border-color:#22d3ee}';
    document.head.appendChild(s);
  }
  function show(k, push){
    if(links[k]==null) k='overview';
    cards.forEach(function(c){ c.classList.toggle('plx-off', c._plx!==k); });
    Object.keys(links).forEach(function(t){ links[t].classList.toggle('on', t==k); links[t].setAttribute('aria-selected', t==k ? 'true' : 'false'); });
    if(k=='matches' || k=='career') cards.forEach(function(c){ if(c._plx==k){ var d=c.tagName=='DETAILS' ? c : c.querySelector('details.pc-dd'); if(d) d.open=true; } });
    if(push) history.pushState({plx:k},'',P+(k=='overview' ? '' : '?tab='+k));
  }
  function morePlayers(after){
    var mh=Array.prototype.filter.call(document.querySelectorAll('h2'),function(h){ return /^More .*players/i.test(txt(h)); })[0];
    if(mh==null) return;
    var ul=mh.nextElementSibling; if(ul==null || ul.tagName!='UL') return;
    var box=document.createElement('div'); box.className='plx-more';
    var sm=document.createElement('small'); sm.textContent=txt(mh); box.appendChild(sm);
    var row=document.createElement('div'); box.appendChild(row);
    Array.prototype.forEach.call(ul.querySelectorAll('a'),function(a){ row.appendChild(a); });
    after.parentNode.insertBefore(box, after.nextSibling); mh.remove(); ul.remove();
  }
  function build(){
    var all=Array.prototype.slice.call(document.querySelectorAll('section.card, details.pc-dd'));
    cards=all.filter(function(c){ return all.every(function(o){ return o===c || o.contains(c)==false; }) && head(c); });
    if(cards.length<3) return false;
    css();
    var used={};
    cards.forEach(function(c){ var t=head(c), k='overview'; for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(t)){ k=MAP[i][1]; break; } } c._plx=k; used[k]=1; c.setAttribute('role','tabpanel'); if(k=='traits') c.classList.add('plx-full'); });
    nav=document.createElement('nav'); nav.className='plx-tabs'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Player sections');
    cards[0].parentNode.insertBefore(nav, cards[0]);
    TABS.forEach(function(t){
      if(used[t[0]]==null) return;
      var a=document.createElement('a'); a.href=P+(t[0]=='overview' ? '' : '?tab='+t[0]); a.textContent=t[1]; a.setAttribute('role','tab');
      a.addEventListener('click',function(e){ e.preventDefault(); show(t[0], true); });
      nav.appendChild(a); links[t[0]]=a;
    });
    morePlayers(nav);
    var m=location.search.match(/[?&]tab=([a-z]+)/);
    show(m ? m[1] : 'overview', false);
    return true;
  }
  /* FILLBADGE_20261031: badge only while the player has no data */
  (function(){ var k=0; (function w(){ k++;
    var b=document.querySelectorAll('.nmw-fill'); if(b.length==0){ if(k<25) setTimeout(w,200); return; }
    var apps=0; Array.prototype.forEach.call(document.querySelectorAll('section.card'),function(c){ var h=c.querySelector('h2'); if(h && /this season/i.test(h.textContent)){ var n=c.querySelector('b,strong,.n,.v'); var m=(c.textContent||'').match(/(\d+)\s*Apps/i); apps=m ? +m[1] : (n ? parseInt(n.textContent,10)||0 : 0); } });
    var seasons=document.querySelectorAll('details.pc-dd details, details.pc-dd summary').length;
    if(apps>0 || seasons>2) (function(){ if(document.getElementById('nmw-full-css')==null){ var st=document.createElement('style'); st.id='nmw-full-css'; st.textContent='html.nmw-full .nmw-fill{display:none'+String.fromCharCode(32,33)+'important}'; document.head.appendChild(st); } document.documentElement.classList.add('nmw-full'); })();
  })(); })();
  window.addEventListener('popstate',function(){ if(nav==null) return; var m=location.search.match(/[?&]tab=([a-z]+)/); show(m ? m[1] : 'overview', false); });
  var k=0;
  (function wait(){ k++; if(build() || k>40){ document.documentElement.classList.add('plx-ready'); return; } setTimeout(wait,120); })();
})();
