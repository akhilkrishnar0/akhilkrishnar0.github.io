/* Procedural cosmic scrollytelling. Original animation, no runtime dependencies. */
(()=>{
  'use strict';
  const canvas=document.getElementById('cosmos');
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx)return;
  const modeButtons=[...document.querySelectorAll('[data-mode]')];
  const label=document.getElementById('context-name');
  const distance=document.getElementById('context-distance');
  const dot=document.getElementById('status-dot');
  const modes={earth:{label:'Earth',distance:'0 light-seconds',color:'#3b82f6'},moon:{label:'Moon',distance:'1.3 light-seconds',color:'#8e98ae'},sun:{label:'Sun',distance:'8.3 light-minutes',color:'#f59e0b'},galaxy:{label:'Galaxy',distance:'26,000 light-years',color:'#7476e9'},universe:{label:'Universe',distance:'13.8 billion light-years',color:'#a855f7'}};
  let current='earth',W=0,H=0,D=1,raf=0,mouse={x:0,y:0},pointer={x:0,y:0};
  let scrollTarget=0,visualProgress=0,lastFrame=0,freezeAt=0;
  const stages=['earth','moon','sun','galaxy','universe'];
  const breaks=[.20,.42,.68,.88];
  let reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng=(seed)=>()=>((seed=Math.imul(seed^seed>>>15,1|seed),seed^=seed+Math.imul(seed^seed>>>7,61|seed),((seed^seed>>>14)>>>0)/4294967296));
  const rand=rng(1234567);
  const stars=Array.from({length:175},()=>({x:rand(),y:rand(),radius:.35+rand()*1.35,phase:rand()*6.3,speed:.4+rand()*1.3,opacity:.12+rand()*.38,tint:rand()}));
  const constellations=[
    {color:'#b3dfff',points:[[.137,.397],[.17,.37],[.204,.409],[.184,.469],[.17,.461],[.156,.46],[.141,.539],[.206,.531],[.184,.469],[.17,.37]],links:[[0,1],[1,2],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[2,8],[3,5]]},
    {color:'#d3e7ff',points:[[.735,.352],[.757,.372],[.779,.379],[.806,.393],[.845,.393],[.84,.447],[.803,.452],[.803,.393]],links:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
    {color:'#dcb76d',points:[[.391,.816],[.404,.831],[.418,.816],[.429,.854],[.408,.878],[.392,.866],[.388,.909]],links:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6]]},
    {color:'#c5a85d',points:[[.459,.852],[.466,.815],[.48,.791],[.489,.834],[.475,.87],[.465,.897],[.477,.917]],links:[[0,1],[1,2],[2,3],[1,4],[4,5],[5,6]]},
    {color:'#d7ad4d',points:[[.55,.755],[.539,.782],[.567,.785],[.575,.764]],links:[[0,1],[1,2],[2,3]]},
    {color:'#aab8ff',points:[[.594,.866],[.617,.846],[.629,.89],[.646,.921],[.635,.946]],links:[[0,1],[1,2],[2,3],[3,4]]},
    {color:'#b9d3fd',points:[[.337,.887],[.314,.904],[.333,.934],[.35,.913],[.359,.951],[.329,.963]],links:[[0,1],[1,2],[2,3],[3,4],[1,5]]},
  ];
  function fit(){D=Math.min(window.devicePixelRatio||1,(window.innerWidth<550?1.4:1.7));W=window.innerWidth;H=window.innerHeight;canvas.width=Math.floor(W*D);canvas.height=Math.floor(H*D);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0)}
  const lerp=(a,b,x)=>a+(b-a)*x;
  const ease=(x)=>x*x*(3-2*x);
  function glow(x,y,r,color,opacity=1){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.save();ctx.globalAlpha=opacity;ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()}
  function star(x,y,r,color='#fff',power=1){glow(x,y,r*8,color,.14*power);glow(x,y,r*3,color,.27*power);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.globalAlpha=Math.min(1,power);ctx.fill();ctx.globalAlpha=1}
  function background(t){ctx.fillStyle='#07080c';ctx.fillRect(0,0,W,H);const g=ctx.createRadialGradient(W*.50,H*1.04,0,W*.5,H*.85,Math.max(W,H)*.85);g.addColorStop(0,'#0a1230');g.addColorStop(.45,'#070911');g.addColorStop(1,'#07080c');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(const s of stars){const f=reduced?1:.65+.35*Math.sin(t*s.speed+s.phase);const depth=.25+s.radius*.55;const sx=((s.x*W+mouse.x*depth+visualProgress*(s.x-.5)*90)%W+W)%W;const sy=((s.y*H+mouse.y*depth-visualProgress*H*(.36+s.radius*.16)-(!reduced?t*.9*s.speed:0))%H+H)%H;ctx.fillStyle=s.tint>.95?`rgba(173,198,255,${s.opacity*f})`:`rgba(201,211,225,${s.opacity*f})`;ctx.beginPath();ctx.arc(sx,sy,s.radius,0,Math.PI*2);ctx.fill()}}
  function arcEarth(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.max(W/1440,H/1000),cx=W*.5,cy=H*.95+500*S,rx=895*S,ry=850*S; // broad astronomical horizon
    ctx.fillStyle='#020b1c';ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.fill();
    // Extended bands of atmospheric light: individual translucent spectral threads.
    for(let i=100;i>=0;i--){const f=i/100,ex=rx+(i+2)*1.14*S,ey=ry+(i+2)*.62*S;const hue=lerp(208,345,f);ctx.beginPath();ctx.ellipse(cx,cy,ex,ey,0,Math.PI*1.05,Math.PI*1.95,false);ctx.strokeStyle=`hsla(${hue},${lerp(89,97,f)}%,${lerp(52,64,f)}%,${lerp(.27,.045,f)})`;ctx.lineWidth=1.5*S;ctx.stroke();}
    // Vertical spectral bars create the telescope-diffraction-like effect on the limb.
    for(let i=0;i<220;i++){const a=Math.PI*(1.075+(i/219)*.85);const ir=rx+5*S,or=rx+(62+Math.sin(i*1.71)*19)*S;const sx=cx+Math.cos(a)*ir,sy=cy+Math.sin(a)*(ry+5*S);const ex=cx+Math.cos(a)*or,ey=cy+Math.sin(a)*(ry+(62+Math.sin(i*1.71)*19)*.57*S);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);const hue=200+120*(.5+.5*Math.sin(i/55));ctx.strokeStyle=`hsla(${hue},100%,63%,${(.025+.065*(.5+.5*Math.sin(i*.21+t*.12)))})`;ctx.lineWidth=4*S;ctx.stroke();}
    ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,Math.PI*1.02,Math.PI*1.98,false);ctx.strokeStyle='rgba(54,171,255,.61)';ctx.lineWidth=3*S;ctx.shadowBlur=15*S;ctx.shadowColor='#1f9fff';ctx.stroke();ctx.shadowBlur=0;
    // Diffuse underglow along the outer upper atmosphere.
    glow(cx,cy-ry-13*S,260*S,'#a35aef',.09);
    ctx.setLineDash([5*S,10*S]);ctx.lineWidth=1*S;ctx.beginPath();ctx.ellipse(cx,cy,rx+260*S,ry+195*S,0,Math.PI*1.05,Math.PI*1.95,false);ctx.strokeStyle='rgba(27,134,211,.6)';ctx.stroke();ctx.setLineDash([]);
    ctx.restore();}
  function moon(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.max(W/1440,H/1000),cx=W*.53,cy=H+620*S,r=850*S;glow(cx,cy-r,300*S,'#8ca3d3',.13);ctx.fillStyle='#181c2c';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();let g=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy);g.addColorStop(0,'#909db1');g.addColorStop(.34,'#536178');g.addColorStop(.76,'#1e2434');g.addColorStop(1,'#131624');ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();ctx.globalAlpha*=.65;ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,2*r,2*r);const rd=rng(3543);for(let i=0;i<210;i++){const theta=rd()*Math.PI*2,rad=Math.sqrt(rd())*r,x=cx+rad*Math.cos(theta),y=cy+rad*Math.sin(theta),cr=(3+rd()*60)*S;ctx.strokeStyle=`rgba(5,9,18,${.03+rd()*.12})`;ctx.lineWidth=(1+rd()*4)*S;ctx.beginPath();ctx.ellipse(x,y,cr,cr*.72,0,0,Math.PI*2);ctx.stroke();}ctx.restore();ctx.beginPath();ctx.arc(cx,cy,r,Math.PI*1.1,Math.PI*1.9);ctx.strokeStyle='rgba(198,214,240,.74)';ctx.lineWidth=2*S;ctx.shadowBlur=23*S;ctx.shadowColor='#c3d5ff';ctx.stroke();ctx.restore()}
  function sun(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.max(W/1440,H/1000),cx=W*.5,cy=H+680*S,r=840*S;for(let i=8;i>=0;i--)glow(cx,cy-r,230*S+i*29*S,`rgba(244,${90+i*4},38,1)`,(.07+i*.006)*alpha);let g=ctx.createRadialGradient(cx,cy-r*.8,r*.05,cx,cy,r);g.addColorStop(0,'#fff0b8');g.addColorStop(.45,'#ff9e20');g.addColorStop(.95,'#b63a10');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();for(let i=0;i<180;i++){const a=Math.PI*(1.04+i/180*.92),dist=(r+Math.sin(i*1.92+t*.4)*26*S);ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(r-3*S),cy+Math.sin(a)*(r-3*S));ctx.lineTo(cx+Math.cos(a)*(dist+18*S),cy+Math.sin(a)*(dist+18*S));ctx.strokeStyle=`rgba(255,${85+Math.floor(i%75)},55,${.08+.09*Math.sin(i*.5)**2})`;ctx.lineWidth=1.5*S;ctx.stroke()}ctx.beginPath();ctx.arc(cx,cy,r,Math.PI*1.06,Math.PI*1.94);ctx.strokeStyle='#ffbc55';ctx.lineWidth=3*S;ctx.shadowColor='#ff722b';ctx.shadowBlur=36*S;ctx.stroke();ctx.restore()}
  function galaxy(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.max(W/1440,H/1000),x=W*.52,y=H*.94,r=480*S;ctx.translate(x,y);ctx.rotate(-.18);glow(0,0,r*.95,'#293e8a',.13);glow(0,0,r*.4,'#ab82ef',.19);glow(0,0,70*S,'#ffe4b1',.23);const rd=rng(99412);for(let arm=0;arm<4;arm++){for(let i=0;i<850;i++){const frac=(i+rd()*.7)/850;const theta=frac*Math.PI*3+arm*Math.PI/2+(reduced?0:t*.015);const radial=r*Math.pow(frac,.78);const spread=(rd()-.5)*(14+65*frac)*S;const sx=Math.cos(theta)*(radial+spread),sy=Math.sin(theta)*(radial+spread)*.38;ctx.fillStyle=['rgba(130,170,255,.45)','rgba(194,148,241,.46)','rgba(251,207,166,.44)','rgba(108,145,247,.32)'][arm];ctx.beginPath();ctx.arc(sx,sy,(rd()*1.4+.25)*S,0,2*Math.PI);ctx.fill()}}star(0,0,7*S,'#fff0cb',1);ctx.restore()}
  function universe(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.max(W/1440,H/1000);glow(W*.32,H*.82,370*S,'#713dcd',.15);glow(W*.74,H*.79,370*S,'#284cc5',.13);glow(W*.53,H*.98,500*S,'#a42e7b',.1);const rd=rng(77298);const nodes=Array.from({length:110},()=>({x:rd()*W,y:H*.53+rd()*H*.66}));for(let i=0;i<nodes.length;i++){let p=nodes[i];for(let j=i+1;j<nodes.length;j++){let q=nodes[j],dx=p.x-q.x,dy=p.y-q.y;const d=Math.hypot(dx,dy);if(d<125*S){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(147,114,244,${(.11*(1-d/(125*S))).toFixed(4)})`;ctx.lineWidth=.6*S;ctx.stroke()}}ctx.fillStyle=i%4===0?'rgba(210,167,255,.63)':'rgba(151,170,252,.45)';ctx.beginPath();ctx.arc(p.x,p.y,(i%6===0?1.9:1.05)*S,0,Math.PI*2);ctx.fill()}ctx.restore()}
  function constellation(t,alpha=1){ctx.save();ctx.globalAlpha=alpha;const S=Math.min(W/1440,H/1000);for(const group of constellations){if(group.points.some(p=>p[1]*H<80))continue;ctx.strokeStyle='rgba(192,203,225,.40)';ctx.lineWidth=.95*S;for(let [a,b] of group.links){let p=group.points[a],q=group.points[b];ctx.beginPath();ctx.moveTo(p[0]*W+mouse.x*.1,p[1]*H+mouse.y*.1);ctx.lineTo(q[0]*W+mouse.x*.1,q[1]*H+mouse.y*.1);ctx.stroke()}for(let i=0;i<group.points.length;i++){const p=group.points[i],x=p[0]*W+mouse.x*.1,y=p[1]*H+mouse.y*.1,big=i%4===0;star(x,y,(big?3.9:2.25)*S,group.color,big?.98:.9)}}ctx.restore()}
  // Procedural shooting stars, planetary orbit trace and luminous points
  // move continuously; the scroll position independently changes their depth.
  function skyDetails(t){
    const S=Math.min(W/1440,H/1000);const k=Math.max(.48,S);
    const cx=W*.864+mouse.x*.16,cy=H*.16+Math.sin(t*.23)*6;
    ctx.save();
    if(visualProgress<.43){
      const alpha=1-Math.max(0,visualProgress-.25)*5;
      ctx.globalAlpha=Math.max(0,alpha);
      ctx.beginPath();ctx.setLineDash([2*k,6*k]);ctx.moveTo(cx,cy);ctx.lineTo(cx-31*k,cy+219*k);
      ctx.strokeStyle='rgba(49,158,237,.52)';ctx.lineWidth=.9*k;ctx.stroke();ctx.setLineDash([]);
      star(cx,cy,3.8*k,'#fff5bb',.98);
    }
    // Travelling glints are sparse to keep the sky quietly alive, not distracting.
    if(!reduced){
      for(let i=0;i<3;i++){
        const phase=((t*.043+i*.323)%1),edge=phase*(W+430*k)-215*k;
        const sy=H*(.13+i*.19)+50*k*Math.sin(i*1.71);
        const visible=Math.pow(Math.sin(phase*Math.PI),7)*(.13+.22*visualProgress);
        if(visible<.014)continue;
        ctx.beginPath();ctx.moveTo(edge-38*k,sy+12*k);ctx.lineTo(edge,sy);
        ctx.strokeStyle=`rgba(176,206,254,${visible})`;ctx.lineWidth=.9*k;ctx.stroke();
        star(edge,sy,1.2*k,'#b7d6ff',visible*2);
      }
    }
    ctx.restore();
  }
  const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
  const smoothstep=(e0,e1,x)=>ease(clamp((x-e0)/(e1-e0)));
  function sceneWeights(p){
    let weights=[1,0,0,0,0];
    for(let i=0;i<breaks.length;i++){
      const half=i===3?.083:.086;
      const k=smoothstep(breaks[i]-half,breaks[i]+half,p);
      weights[i]*=1-k;
      weights[i+1]+=k;
    }
    return weights;
  }
  function drawMode(mode,t,alpha){
    if(alpha<.004)return;
    ctx.save();
    const idx=stages.indexOf(mode);
    const spanStart=idx?breaks[idx-1]:0, spanEnd=breaks[idx]??1;
    const f=clamp((visualProgress-spanStart)/(spanEnd-spanStart));
    // A slow telescope-style push/pull creates continuous motion between views.
    const mag=(mode==='earth'?.998+f*.105:mode==='moon'?1.012+f*.10:
      mode==='sun'?1.08-f*.10:mode==='galaxy'?1.015+f*.1:1.02+f*.18);
    ctx.translate(W/2,H/2);
    ctx.scale(mag,mag);
    ctx.translate(-W/2+mouse.x*.28,-H/2+mouse.y*.19-f*22);
    switch(mode){
      case 'earth':arcEarth(t,alpha);break;
      case 'moon':moon(t,alpha);break;
      case 'sun':sun(t,alpha);break;
      case 'galaxy':galaxy(t,alpha);break;
      case 'universe':universe(t,alpha);break;
    }
    ctx.restore();
  }
  function render(ms){
    // 30–60 fps; scroll position is interpolated instead of jumping by stage.
    if(!reduced && ms-lastFrame < (W<520?28:13)) {raf=requestAnimationFrame(render);return;}
    lastFrame=ms;
    const t=ms*.001;
    const motion=reduced?1:.075;
    visualProgress+=(scrollTarget-visualProgress)*motion;
    mouse.x+=(pointer.x-mouse.x)*(reduced?1:.05);
    mouse.y+=(pointer.y-mouse.y)*(reduced?1:.05);
    if(Math.abs(visualProgress-scrollTarget)<.00001)visualProgress=scrollTarget;
    ctx.setTransform(D,0,0,D,0,0);
    background(t);
    const weights=sceneWeights(visualProgress);
    for(let i=0;i<stages.length;i++)if(weights[i]>.003)drawMode(stages[i],t,weights[i]);
    constellation(t,clamp(weights[0]+weights[1]*.53+weights[2]*.18+weights[3]*.28+weights[4]*.12));
    skyDetails(t);
    if(!reduced)raf=requestAnimationFrame(render);
  }
  function modeAt(p){
    if(p<breaks[0])return 'earth';
    if(p<breaks[1])return 'moon';
    if(p<breaks[2])return 'sun';
    if(p<breaks[3])return 'galaxy';
    return 'universe';
  }
  function displayStage(mode){
    if(!modes[mode] || mode===current) return;
    current=mode;
    modeButtons.forEach(b=>{
      const yes=b.dataset.mode===mode;
      b.classList.toggle('is-active',yes);
      b.setAttribute('aria-selected',String(yes));
      b.tabIndex=yes?0:-1;
    });
    label.textContent=modes[mode].label;
    distance.textContent=modes[mode].distance;
    dot.style.background=modes[mode].color;
    document.body.dataset.cosmicStage=mode;
  }
  function getProgress(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    return max>0?clamp(window.scrollY/max):0;
  }
  let scrollPending=false;
  function onScroll(){
    if(scrollPending)return;
    scrollPending=true;
    requestAnimationFrame(()=>{
      scrollTarget=getProgress();
      displayStage(modeAt(scrollTarget));
      if(reduced)render(performance.now());
      scrollPending=false;
    });
  }
  // Use the real browser scroll, so keyboard, trackpad, swipes and wheel all
  // explore the same five stages. Tabs scroll to their corresponding chapter.
  function goTo(mode){
    const chapter=document.getElementById(mode);
    if(!chapter)return;
    const navHeight=document.querySelector('.site-header')?.offsetHeight||57;
    const y=chapter.getBoundingClientRect().top+window.scrollY-navHeight-6;
    window.scrollTo({top:Math.max(0,y),behavior:reduced?'instant':'smooth'});
    try{history.replaceState(null,'','#'+mode)}catch(e){}
  }
  modeButtons.forEach((btn,i)=>{
    btn.addEventListener('click',()=>goTo(btn.dataset.mode));
    btn.addEventListener('keydown',(e)=>{
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
      e.preventDefault();const delta=e.key==='ArrowRight'?1:-1;
      const next=modeButtons[(i+delta+modeButtons.length)%modeButtons.length];
      next.focus();goTo(next.dataset.mode);
    });
  });
  document.querySelectorAll('.back-to-earth,.footer-top').forEach(btn=>btn.addEventListener('click',()=>goTo('earth')));
  document.querySelectorAll('.inline-next').forEach(a=>a.addEventListener('click',e=>{
    const mode=a.getAttribute('href').slice(1);
    if(stages.includes(mode)){e.preventDefault();goTo(mode)}
  }));
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{
    fit();scrollTarget=getProgress();
    if(reduced)render(performance.now());
  },{passive:true});
  addEventListener('pointermove',e=>{
    pointer.x=(e.clientX/W-.5)*28;
    pointer.y=(e.clientY/H-.5)*25;
  },{passive:true});
  addEventListener('visibilitychange',()=>{
    if(document.hidden)cancelAnimationFrame(raf);
    else if(!reduced){cancelAnimationFrame(raf);raf=requestAnimationFrame(render)}
  });
  // IntersectionObserver matches the reference's on-enter chapter reveal;
  // the content is kept visible when motion is reduced or JS is disabled.
  if(!reduced && 'IntersectionObserver' in window){
    document.documentElement.classList.add('js-motion');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}
    },{rootMargin:'0px 0px -40px 0px',threshold:.08});
    document.querySelectorAll('.scroll-stage').forEach(s=>observer.observe(s));
  }
  // The 5 stage tabs are only navigation controls; semantic scroll chapters
  // stay in the document for accessibility and search-engine indexing.
  fit();scrollTarget=getProgress();visualProgress=scrollTarget;
  displayStage(modeAt(scrollTarget));
  render(performance.now());
  addEventListener('load',()=>{scrollTarget=getProgress();displayStage(modeAt(scrollTarget));},{once:true});
  const dialog=document.getElementById('research-dialog');
  document.querySelectorAll('.detail-trigger').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(b=>b.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  const copyButton=document.querySelector('.copy-email');
  const status=document.getElementById('copy-status');let copyTimer;
  copyButton.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('akhilkrishna219@gmail.com');status.textContent='Email copied to clipboard'}
    catch(e){status.textContent='Email: akhilkrishna219@gmail.com'}
    status.classList.add('show');clearTimeout(copyTimer);
    copyTimer=setTimeout(()=>status.classList.remove('show'),2400);
  });
  document.getElementById('copyright').textContent=new Date().getFullYear();
})();
