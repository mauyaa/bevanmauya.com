(function(){
  document.addEventListener('error',function(e){if(e.target.tagName==='IMG')e.target.style.visibility='hidden';},true);
  var $=function(id){return document.getElementById(id);}, root=document.documentElement;
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var pad=function(n){return (n<10?'0':'')+n;};
  var media=function(src,alt){return src?'<img src="'+esc(src)+'" alt="'+esc(alt||'')+'" loading="lazy">':'<div class="ph"></div>';};
  var ctx; function tick(f){try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
    o.type='triangle';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.04,t);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.08);}catch(e){}}

  /* clock */
  function clock(){try{var t=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Nairobi'});$('clock').textContent=t;}catch(e){}}
  clock(); setInterval(clock,15000);

  /* profile colour: tap to change it — orange, yellow, blue, black */
  var pcs=['#DA460D','#D4A93E','#3A5A96','#1C1C1B'], pi=0;
  $('avatar').onclick=function(){pi=(pi+1)%pcs.length;$('avatar').style.setProperty('--pc',pcs[pi]);tick([760,980,640,520][pi]);};

  /* home: latest work card */
  /* newest first in content.js: the card cycles through the four latest projects */
  var li=0, LN=Math.min(4,PROJECTS.length);
  function latest(){var L=PROJECTS[li]; $('latest').href='#/work/'+L.slug; $('latestT').textContent=L.title; $('latestL').textContent=L.line; $('latestR').textContent=L.result;}
  latest();
  if(LN>1&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    setInterval(function(){if(document.hidden)return;var c=$('latest');c.classList.add('swap');
      setTimeout(function(){li=(li+1)%LN;latest();c.classList.remove('swap');},260);},5000);}

  /* project identity: an app-icon tile in its colour (or its logo/image if given) */
  function icon(p,lg){var st='--c:'+(p.color||'#3A5A96')+';--f:'+(p.fg||'#F3F2EF');
    return '<span class="icon'+(lg?' lg':'')+'" style="'+st+'" aria-hidden="true">'+(p.logo?'<img src="'+esc(p.logo)+'" alt="">':esc(p.title.charAt(0)))+'</span>';}

  /* work: one featured card, then a calm grid — the same cards as Home */
  /* a coloured letter tile when a project has no image */
  function lt(p){return '<span class="lt"'+(p.color?' style="background:'+esc(p.color)+';color:#F3F2EF"':'')+'>'+esc(p.title.charAt(0))+'</span>';}
  function bgs(p){return p.img&&p.color?' style="background:'+esc(p.color)+'"':'';}
  function pimg(p,alt){return '<img src="'+esc(p.img)+'" alt="'+esc(alt||'')+'"'+(p.pad?' class="pad"':'')+' loading="lazy">';}
  function pitem(p){return '<a class="pitem" href="#/work/'+p.slug+'"><span class="im"'+bgs(p)+'>'+(p.img?pimg(p):lt(p))+'</span><b>'+esc(p.title)+'</b><span class="d">'+esc(p.kind)+'</span></a>';}
  function inGroup(id){return PROJECTS.filter(function(p){return p.group===id;});}
  $('count').textContent=pad(PROJECTS.length);
  $('work').innerHTML=GROUPS.map(function(g){var items=inGroup(g.id);if(!items.length)return '';
    return '<div class="grp-h"><h3>'+esc(g.name)+' <span>· '+esc(g.note)+'</span></h3><span class="mono">'+pad(items.length)+'</span></div><div class="plist">'+items.map(pitem).join('')+'</div>';}).join('');
  $('ccount').textContent=pad(CERTS.length);
  $('certs').innerHTML=CERTS.map(function(c){
    var inner='<img class="clogo" src="'+esc(c.logo)+'" alt="" loading="lazy"><span><b>'+esc(c.name)+'</b><span class="by">'+esc(c.issuer)+'</span></span><span class="mono">'+esc(c.date)+'</span>';
    return '<li>'+(c.url?'<a class="cert" href="'+esc(c.url)+'" target="_blank" rel="noopener" aria-label="Verify '+esc(c.name)+' from '+esc(c.issuer)+'">'+inner+'<span class="go">↗</span></a>':'<div class="cert">'+inner+'<span></span></div>')+'</li>';}).join('');
  function renderGroup(id){
    var g=GROUPS.find(function(x){return x.id===id;}), items=inGroup(id);
    $('gcrumb').textContent=g.name; $('gtitle').textContent=g.name; $('gnum').textContent=pad(items.length);
    $('glist').innerHTML=items.map(pitem).join('');
  }
  var peek={classList:{remove:function(){}}};

  /* gallery: a rail of rounded cards — the chosen one in the middle, neighbours smaller on each side */
  var gi=0, GN=GALLERY.length, OFF=[0,.93,1.68,2.3], SC=[1,.78,.62,.5], OP=[1,.92,.55,0];
  $('gcount').textContent=pad(GN);
  $('gstage').innerHTML=GALLERY.map(function(g,i){return '<button type="button" class="gcard" data-i="'+i+'" aria-label="'+esc(g.title)+'">'+media(g.img,g.title)+'</button>';}).join('');
  $('thumbs').innerHTML=GALLERY.map(function(g,i){return '<button type="button" data-i="'+i+'" aria-label="'+esc(g.title)+'"></button>';}).join('');
  function showPiece(i,quiet){
    gi=(i+GN)%GN; var g=GALLERY[gi];
    $('gstage').querySelectorAll('.gcard').forEach(function(c,k){
      var d=k-gi; if(d>GN/2)d-=GN; if(d<-GN/2)d+=GN; var a=Math.min(Math.abs(d),3), sg=d<0?-1:1;
      c.style.transform='translateX(calc(var(--w)*'+(sg*OFF[a])+')) scale('+SC[a]+')';
      c.style.opacity=OP[a]; c.style.zIndex=10-a; c.classList.toggle('on',d===0); c.tabIndex=d===0?0:-1;
      c.setAttribute('aria-hidden',a>2);});
    $('gname').textContent=g.title; $('gidx').textContent=pad(gi+1)+' / '+pad(GN);
    $('thumbs').querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-current',j===gi);});
    if(!quiet)tick(940);
  }
  $('thumbs').onclick=function(e){var b=e.target.closest('button');if(b)showPiece(+b.dataset.i);};
  $('gstage').onclick=function(e){var c=e.target.closest('.gcard');if(c&&!c.classList.contains('on'))showPiece(+c.dataset.i);};
  $('gstage').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showPiece(gi+1);}};
  (function(){var x0=null,el=$('gstage');el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    el.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){showPiece(gi+(dx<0?1:-1));}x0=null;},{passive:true});})();
  document.addEventListener('keydown',function(e){if(!document.querySelector('[data-view="gallery"].on'))return;if(e.key==='ArrowRight')showPiece(gi+1);else if(e.key==='ArrowLeft')showPiece(gi-1);});
  showPiece(0,true);
  /* rotate on its own every 3.5s; pause while the pointer is over it, while touching, or when the gallery isn't open */
  (function(){var el=$('gstage'),hold=false,last=Date.now();
    var mark=function(){last=Date.now();};
    el.addEventListener('mouseenter',function(){hold=true;});el.addEventListener('mouseleave',function(){hold=false;mark();});
    el.addEventListener('touchstart',mark,{passive:true});['thumbs','gstage'].forEach(function(id){$(id).addEventListener('click',mark);});
    document.addEventListener('keydown',mark);
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    setInterval(function(){if(hold||document.hidden||!document.querySelector('[data-view="gallery"].on')||Date.now()-last<3500)return;showPiece(gi+1,true);mark();},500);})();

  /* segmented stepper (shared by Contact and project pages) */
  function seg(el,n,on){
    el.querySelectorAll('button').forEach(function(b){b.remove();});
    var html='';for(var k=0;k<n;k++)html+='<button type="button" role="tab" data-k="'+k+'">'+pad(k+1)+'</button>';
    el.insertAdjacentHTML('beforeend',html);
    el.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))';
    el.querySelector('.pill').style.width='calc((100% - 8px - '+(4*(n-1))+'px) / '+n+')';
    el.onclick=function(e){var b=e.target.closest('button');if(b)on(+b.dataset.k);};
  }
  function segSet(el,k){el.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-selected',j===k);});el.querySelector('.pill').style.transform='translateX(calc('+k+' * (100% + 4px)))';}

  /* copy email */
  $('copy').onclick=function(){var done=function(){var t=$('toast');t.classList.add('on');$('copy').textContent='Copied ✓';tick(1100);setTimeout(function(){t.classList.remove('on');$('copy').textContent='Copy email';},1600);};
    try{navigator.clipboard.writeText('mauyabevan@gmail.com').then(done,done);}catch(e){done();}};

  /* island */
  var island=$('island'), sub=null, step=0, cur=-1, lbI=-1;
  function mode(m){$('gNav').hidden=m!=='nav';$('gSub').hidden=m!=='sub';island.classList.remove('pop');void island.offsetWidth;island.classList.add('pop');}
  function navOn(v){document.querySelectorAll('#gNav a').forEach(function(a){a.classList.toggle('on',a.dataset.v===v);});}

  /* project: same rhythm as Home — mark, title, lede, chips, then cards */
  function renderProject(i){
    var p=PROJECTS[i], gname=(GROUPS.find(function(g){return g.id===p.group;})||{}).name||'', n=PROJECTS[(i+1)%PROJECTS.length];
    var tile=p.img?pimg(p,p.title):lt(p);
    var X='<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 20 2, 40 10, 60 5 S 90 3, 98 7"/></svg>';
    var links=(p.live?'<a class="btn solid" href="'+esc(p.live)+'" target="_blank" rel="noopener">See it live <span class="arr">↗</span></a>':'')+(p.code?'<a class="btn line" href="'+esc(p.code)+'" target="_blank" rel="noopener">Read the code <span class="arr">↗</span></a>':'');
    $('project').innerHTML=
      '<nav class="crumb mono" aria-label="Breadcrumb"><a href="#/">Bevan</a><span>/</span><a href="#/work">Work</a><span>/</span><span class="here">'+esc(p.title)+'</span></nav>'+
      '<div class="ptile"><span class="pic"'+bgs(p)+'>'+tile+'</span></div>'+
      '<h1>'+esc(p.title)+' — '+esc(p.kind.split(',')[0].toLowerCase())+'. <span>'+esc(p.line)+'</span></h1>'+
      '<p class="idea"><span class="x">'+esc(p.was)+X+'</span> '+esc(p.now)+'.<span class="note">'+esc(gname)+'</span></p>'+
      '<div class="label"><span class="mono">The problem</span></div><p class="lede" style="margin:0">'+esc(p.overview)+'</p>'+
      '<div class="actions">'+[p.role,p.year,p.tools].filter(Boolean).map(function(v){return '<span class="status">'+esc(v)+'</span>';}).join('')+'</div>'+
      '<div class="label"><span class="mono">How it came together</span><span class="mono">'+pad(p.steps.length)+' steps</span></div>'+
      '<div class="card howcard"><div class="stage" id="pstage"><span class="n" id="pN"></span><h3 id="pT"></h3><p id="pD"></p><div id="pImg"></div></div><div class="seg" role="tablist" id="pseg"><span class="pill" aria-hidden="true"></span></div></div>'+
      '<div class="label"><span class="mono">Outcome</span></div>'+
      '<div class="grid3">'+p.metrics.map(function(m){return '<div class="card stat"><span class="mono">'+esc(m[1])+'</span><b>'+esc(m[0])+'</b></div>';}).join('')+'</div>'+
      (links?'<div class="label"><span class="mono">One more thing</span></div><div class="card omt"><span class="mono">'+(p.live?'It’s real — go and use it':'The code is open — read how it’s built')+'</span><div class="actions">'+links+'</div></div>':'')+
      ('<a class="card next" href="#/work/'+n.slug+'"><span class="nx"><span class="th"'+bgs(n)+'>'+(n.img?pimg(n):lt(n))+'</span><span><span class="mono k">Next project</span><span class="t">'+esc(n.title)+'</span></span></span><span class="arr">→</span></a>');
    seg($('pseg'),p.steps.length,function(k){setStep(k);});
    $('pseg').querySelectorAll('button').forEach(function(b,k){b.textContent=p.steps[k].t;});
    step=-1; setStep(0,true);
  }
  function setStep(k,quiet){
    var p=PROJECTS[cur]; k=Math.max(0,Math.min(p.steps.length-1,k)); if(k===step)return; step=k;
    var s=p.steps[k], st=$('pstage');
    var apply=function(){$('pN').textContent='Step '+pad(k+1)+' / '+pad(p.steps.length);$('pT').textContent=s.t;$('pD').textContent=s.d;
      $('pImg').innerHTML=s.img?'<div class="img">'+media(s.img,s.t)+'</div>':'';st.classList.remove('out');};
    if(quiet)apply(); else {st.classList.add('out');setTimeout(apply,170);tick(880+k*110);}
    segSet($('pseg'),k);
    $('sLabel').textContent=pad(k+1)+' / '+pad(p.steps.length); $('sPrev').disabled=k===0; $('sNext').disabled=k===p.steps.length-1;
  }

  /* lightbox */
  function lbShow(){var g=GALLERY[lbI];$('lbPic').innerHTML=media(g.img,g.title);$('lbCap').textContent=g.title;$('lbMeta').textContent=pad(lbI+1)+' / '+pad(GALLERY.length);
    $('sLabel').textContent=pad(lbI+1)+' / '+pad(GALLERY.length);$('sPrev').disabled=lbI===0;$('sNext').disabled=lbI===GALLERY.length-1;}
  function lbOpen(i){lbI=i;lbShow();$('lb').classList.add('on');sub='lb';mode('sub');}
  function lbClose(){$('lb').classList.remove('on');lbI=-1;sub=null;mode('nav');}
  $('lb').onclick=function(e){if(e.target===$('lb'))lbClose();};
  var x0=null; $('lb').addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  $('lb').addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)(dx<0?$('sNext'):$('sPrev')).click();x0=null;},{passive:true});

  /* island sub-controls */
  $('sBack').onclick=function(){if(sub==='lb')lbClose();else go('/work');};
  $('sPrev').onclick=function(){if(sub==='lb'){if(lbI>0){lbI--;lbShow();tick(960);}}else setStep(step-1);};
  $('sNext').onclick=function(){if(sub==='lb'){if(lbI<GALLERY.length-1){lbI++;lbShow();tick(960);}}else setStep(step+1);};
  document.addEventListener('keydown',function(e){if(!sub)return;if(e.key==='Escape')$('sBack').click();else if(e.key==='ArrowRight')$('sNext').click();else if(e.key==='ArrowLeft')$('sPrev').click();});

  /* router — one page at a time. Links are handled here (not by the browser),
     so pages switch even inside app previews and sandboxed viewers. */
  var here='/';
  function go(path,push){
    path=path||'/'; here=path;
    if(push!==false){try{history.pushState({p:path},'',path==='/'?location.pathname+location.search:'#'+path);}catch(e){}}
    route(path);
  }
  function route(path){
    var parts=String(path).replace(/^#?\/?/,'').split('/'), v=parts[0]||'home';
    if(sub==='lb')lbClose();
    if(v==='work'&&parts[1]==='g'&&GROUPS.some(function(g){return g.id===parts[2];})){renderGroup(parts[2]);v='group';}
    else if(v==='work'&&parts[1]){var i=PROJECTS.findIndex(function(p){return p.slug===parts[1];});if(i>-1){cur=i;renderProject(i);v='project';}else v='work';}
    if(['home','work','group','project','gallery','contact'].indexOf(v)<0)v='home';
    document.querySelectorAll('.view').forEach(function(s){s.classList.toggle('on',s.dataset.view===v);});
    if(v==='project'){sub='project';mode('sub');}else{sub=null;mode('nav');navOn(v==='group'?'work':v);}
    peek.classList.remove('on');
    try{window.scrollTo(0,0);}catch(e){}
    document.title=v==='home'?'Bevan Mauya':(v==='project'?PROJECTS[cur].title:v==='group'?$('gtitle').textContent:v.charAt(0).toUpperCase()+v.slice(1))+' — Bevan Mauya';
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#/"]');
    if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;
    e.preventDefault(); go(a.getAttribute('href').slice(1));
  });
  window.addEventListener('popstate',function(){var h='';try{h=location.hash;}catch(e){} go(h.replace(/^#/,'')||'/',false);});
  var start='/'; try{start=(location.hash||'').replace(/^#/,'')||'/'; if(start==='/'&&location.hash)history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  go(start,false);
})();
