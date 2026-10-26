/* Spaceship view: original zero-dependency scroll-driven Canvas 2D visualisation. */
(()=>{
'use strict';
const canvas=document.getElementById('universe-canvas');
const ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
if(!ctx)return;
const sections=[...document.querySelectorAll('.story-stage')];
const names=['earth','moon','mars','saturn','escape'];
const nav=[...document.querySelectorAll('.nav-stop')];
const nodes=[...document.querySelectorAll('.progress-node')];
const locationLabel=document.getElementById('hud-location');
const distanceLabel=document.getElementById('hud-distance');
const travelLabel=document.getElementById('travel-status');
const progressFill=document.getElementById('progress-fill');
const counter=document.getElementById('side-counter');
document.getElementById('year').textContent=new Date().getFullYear();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const info=[
  {place:'EARTH / DEPARTURE',distance:'0 KM',flight:'ORBITAL ASCENT'},
  {place:'MOON / LUNAR TRANSFER',distance:'384,400 KM',flight:'LUNAR APPROACH'},
  {place:'MARS / INNER SOLAR SYSTEM',distance:'225 M KM',flight:'MARS ORBIT INSERTION'},
  {place:'SATURN / OUTER PLANETS',distance:'1.4 B KM',flight:'RING PLANE CROSSING'},
  {place:'BEYOND / SOLAR ESCAPE',distance:'17 B+ KM',flight:'HELIOCENTRIC ESCAPE'}
];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>x*x*(3-2*x);
const lerp=(a,b,t)=>a+(b-a)*t;
const rand=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
let W=innerWidth,H=innerHeight,D=1,target=0,p=0,lastFrame=0,raf=0,mouseX=0,mouseY=0,pointerX=0,pointerY=0,scrollMax=1,anchors=[];
let visited=new Set();
const stars=[];const random=rand(7139);
for(let i=0;i<370;i++)stars.push({x:random(),y:random(),size:.35+random()*1.45,depth:.13+random()*1.6,phase:random()*Math.PI*2,lum:.23+random()*.64,tint:random()});
const travelDust=[];for(let i=0;i<95;i++)travelDust.push({x:random(),y:random(),size:random()*1.2+.3,speed:.22+random()*.75});
function newCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function blob(c,x,y,r,color,alpha=1){c.save();const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
function circle(c,x,y,r,fill){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill()}
function makePlanet(kind){
 const size=820,r=size*.46,c=newCanvas(size,size),g=c.getContext('2d');const cx=size/2,cy=size/2;
 g.save();g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.clip();
 let gr=g.createLinearGradient(0,size*.15,size,size*.9);
 if(kind==='earth'){gr.addColorStop(0,'#23669b');gr.addColorStop(.48,'#105080');gr.addColorStop(.78,'#043354');gr.addColorStop(1,'#09263a')}
 if(kind==='moon'){gr.addColorStop(0,'#d1d1c9');gr.addColorStop(.45,'#918f8d');gr.addColorStop(1,'#454950')}
 if(kind==='mars'){gr.addColorStop(0,'#dc9f71');gr.addColorStop(.38,'#be6a44');gr.addColorStop(.7,'#7c3b29');gr.addColorStop(1,'#502928')}
 if(kind==='saturn'){gr.addColorStop(0,'#e3d1a6');gr.addColorStop(.47,'#c5a884');gr.addColorStop(.79,'#9a8065');gr.addColorStop(1,'#564d4c')}
 g.fillStyle=gr;g.fillRect(0,0,size,size);
 const rng=rand(({earth:43,moon:344,mars:574,saturn:791})[kind]);
 if(kind==='earth'){
  // Abstract continental landmasses, with distinct ocean, cloud and atmosphere layers.
  const land=[
   [[.23,.19],[.42,.15],[.48,.21],[.44,.28],[.49,.34],[.44,.43],[.33,.46],[.29,.39],[.24,.34],[.2,.24]],
   [[.47,.47],[.56,.45],[.61,.51],[.59,.63],[.54,.74],[.49,.84],[.44,.74],[.46,.62]],
   [[.58,.22],[.73,.20],[.85,.28],[.88,.39],[.78,.44],[.68,.38],[.61,.31]],
   [[.70,.56],[.80,.57],[.85,.64],[.79,.71],[.70,.69]]
  ];
  for(const pts of land){g.beginPath();pts.forEach((v,i)=>i===0?g.moveTo(v[0]*size,v[1]*size):g.lineTo(v[0]*size,v[1]*size));g.closePath();g.fillStyle='#426f5f';g.fill();g.strokeStyle='#759a7f4d';g.lineWidth=10;g.stroke()}
  for(let i=0;i<290;i++){let y=size*rng(),x=size*rng(),len=8+rng()*90;g.beginPath();g.ellipse(x,y,len,2+rng()*7,-.36+rng()*.2,0,Math.PI*2);g.fillStyle=`rgba(234,249,255,${.018+rng()*.16})`;g.fill()}
  for(let i=0;i<130;i++){let x=size*rng(),y=size*rng();circle(g,x,y,1+rng()*3,`rgba(161,232,252,${.025+rng()*.05})`)}
 }else if(kind==='moon'){
  for(let i=0;i<1150;i++){let x=rng()*size,y=rng()*size,rr=1+rng()*18;circle(g,x,y,rr,`rgba(${Math.floor(80+rng()*80)},${Math.floor(80+rng()*80)},${Math.floor(80+rng()*80)},${.018+rng()*.10})`)}
  for(let i=0;i<115;i++){let x=rng()*size,y=rng()*size,rr=3+rng()*40;g.beginPath();g.ellipse(x,y,rr,rr*(.8+rng()*.3),0,0,Math.PI*2);g.strokeStyle=`rgba(235,233,226,${.06+rng()*.21})`;g.lineWidth=1.8+rng()*4;g.stroke();g.beginPath();g.ellipse(x-2,y+3,rr*.65,rr*.66,0,0,Math.PI*2);g.fillStyle=`rgba(32,35,41,${.02+rng()*.14})`;g.fill()}
 }else if(kind==='mars'){
  for(let i=0;i<760;i++){let x=rng()*size,y=rng()*size,rr=6+rng()*52;g.beginPath();g.ellipse(x,y,rr,rr*(.25+rng()*.9),rng()*3,0,2*Math.PI);g.fillStyle=`rgba(${rng()>.55?'89,48,36':'235,170,114'},${.012+rng()*.07})`;g.fill()}
  for(let i=0;i<55;i++){let x=rng()*size,y=rng()*size,rr=2+rng()*27;g.beginPath();g.ellipse(x,y,rr,rr*.59,0,0,Math.PI*2);g.strokeStyle='rgba(73,43,36,.13)';g.lineWidth=2;g.stroke()}
  blob(g,size*.55,size*.13,210,'#fff4d9',.36);
 }else if(kind==='saturn'){
  for(let i=0;i<140;i++){let y=i*size/140,thickness=2+rng()*17;g.fillStyle=i%7===0?'rgba(248,231,182,.17)':i%5===0?'rgba(75,61,57,.18)':'rgba(255,241,203,.045)';g.fillRect(0,y,size,thickness)}
 }
 // Spherical limb shading and specular illuminated crescent.
 let shade=g.createRadialGradient(cx-r*.33,cy-r*.28,r*.12,cx+r*.13,cy+r*.10,r*1.4);
 shade.addColorStop(0,'rgba(248,255,255,.17)');shade.addColorStop(.36,'rgba(255,255,255,0)');shade.addColorStop(.70,'rgba(4,7,19,.18)');shade.addColorStop(1,'rgba(0,1,8,.88)');g.fillStyle=shade;g.fillRect(0,0,size,size);
 const limb=g.createLinearGradient(cx-r,cy-r,cx+r,cy+r);limb.addColorStop(0,'rgba(255,255,255,.13)');limb.addColorStop(.45,'transparent');limb.addColorStop(1,'rgba(0,0,0,.16)');g.fillStyle=limb;g.fillRect(0,0,size,size);
 g.restore();return c;
}
const textures={earth:makePlanet('earth'),moon:makePlanet('moon'),mars:makePlanet('mars'),saturn:makePlanet('saturn')};
function resize(){W=Math.max(280,innerWidth);H=Math.max(350,innerHeight);D=Math.min(devicePixelRatio||1,W<700?1.5:2);canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0);scrollMax=Math.max(1,document.documentElement.scrollHeight-H);anchors=sections.map(s=>clamp(s.offsetTop/scrollMax));target=clamp(scrollY/scrollMax);if(reduced){p=target;paint(performance.now()*.001)}}
function starfield(t,sp){ctx.save();const movement=sp*120;for(let i=0;i<stars.length;i++){let s=stars[i],x=((s.x*W+movement*s.depth+mouseX*s.depth*.02)%(W+80)+W+80)%(W+80)-40;let y=((s.y*H+movement*.19*s.depth+mouseY*s.depth*.018)%(H+80)+H+80)%(H+80)-40;let shine=(.76+.24*Math.sin(t*(.48+s.depth*.3)+s.phase));ctx.globalAlpha=s.lum*shine;ctx.fillStyle=s.tint>.85?'#ffe4be':s.tint>.61?'#b6d8ff':'#f1faff';ctx.beginPath();ctx.arc(x,y,s.size,0,2*Math.PI);ctx.fill();if(s.size>1.5 && i%4===0){ctx.strokeStyle='rgba(167,209,242,.23)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke()}}ctx.restore()}
function glow(x,y,r,colors,alpha=1){ctx.save();ctx.globalAlpha=alpha;const gradient=ctx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,colors);gradient.addColorStop(1,'transparent');ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()}
function drawSphere(tex,cx,cy,r,alpha=1){ctx.save();ctx.globalAlpha*=alpha;const size=r*2;ctx.shadowColor='rgba(14,26,50,.8)';ctx.shadowBlur=r*.13;ctx.drawImage(tex,cx-r,cy-r,size,size);ctx.restore()}
function outlineOrbit(cx,cy,r,angle,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);ctx.rotate(angle);ctx.strokeStyle='#759bc5';ctx.lineWidth=.8;ctx.setLineDash([3,9]);ctx.beginPath();ctx.ellipse(0,0,r*1.8,r*.53,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
function ring(cx,cy,r,front){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.28);ctx.scale(1,.35);const start=front?0:Math.PI,end=front?Math.PI:Math.PI*2;for(let i=45;i>=0;i--){const rr=r*(1.31+i*.018);ctx.beginPath();ctx.ellipse(0,0,rr,rr,0,start,end);const op=i>36?.30:i>20?.48:.13;ctx.strokeStyle=i%8<2?`rgba(91,92,107,${op})`:i%5===0?`rgba(240,219,169,${op})`:`rgba(202,185,151,${op})`;ctx.lineWidth=r*.015;ctx.stroke()}ctx.strokeStyle='rgba(246,235,209,.52)';ctx.lineWidth=r*.012;ctx.beginPath();ctx.ellipse(0,0,r*1.78,r*1.78,0,start,end);ctx.stroke();ctx.restore()}
function horizonEarth(t,u,alpha){ctx.save();ctx.globalAlpha=alpha;let travel=ease(clamp(u));const x=W*.69,y=lerp(H*2.06,H*.66,travel),r=lerp(H*1.23,Math.min(W,H)*.3,travel);glow(x,y-r,r*.58,'rgba(36,147,247,.38)',.9);drawSphere(textures.earth,x,y,r,1);
 ctx.beginPath();ctx.arc(x,y,r+3,-Math.PI*.99,-.02);ctx.strokeStyle='rgba(71,195,251,.85)';ctx.lineWidth=Math.max(2,11*(1-travel));ctx.shadowBlur=25;ctx.shadowColor='#54b6e9';ctx.stroke();ctx.shadowBlur=0;ctx.restore();}
function sceneEarth(t,u,a){horizonEarth(t,u,a);if(u<.52){ctx.save();ctx.globalAlpha=a*(1-ease(clamp(u*1.9)))*.7;const grad=ctx.createLinearGradient(0,H*.23,0,H);grad.addColorStop(0,'rgba(9,55,107,0)');grad.addColorStop(.48,'rgba(53,127,178,.12)');grad.addColorStop(1,'rgba(24,92,119,.16)');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);ctx.restore();}}
function sceneMoon(t,u,a){const size=Math.min(W,H);const r=size*lerp(.13,.43,ease(clamp(u*1.08)));const x=W*.70+Math.sin(t*.12)*6,y=H*.56+Math.sin(t*.19)*7;ctx.save();ctx.globalAlpha=a;glow(x,y,r*2,'rgba(134,157,188,.17)',.48);drawSphere(textures.moon,x,y,r);outlineOrbit(x,y,r,-.23,.13);ctx.restore()}
function sceneMars(t,u,a){const size=Math.min(W,H);const r=size*lerp(.17,.46,ease(clamp(u*1.06)));const x=W*.71+Math.sin(t*.12)*7,y=H*.54+Math.sin(t*.16)*8;ctx.save();ctx.globalAlpha=a;glow(x,y,r*2.1,'rgba(236,91,39,.12)',.5);drawSphere(textures.mars,x,y,r);outlineOrbit(x,y,r,-.1,.13);ctx.restore()}
function sceneSaturn(t,u,a){const size=Math.min(W,H);const r=size*lerp(.105,.34,ease(clamp(u*1.05)));const x=W*.70+Math.sin(t*.11)*6,y=H*.51+Math.sin(t*.14)*7;ctx.save();ctx.globalAlpha=a;glow(x,y,r*3,'rgba(192,142,94,.085)',.5);ring(x,y,r,false);drawSphere(textures.saturn,x,y,r);ring(x,y,r,true);ctx.restore()}
function sceneEscape(t,u,a){ctx.save();ctx.globalAlpha=a;const x=W*.68, y=H*.53;glow(x,y,Math.min(W,H)*.7,'rgba(32,92,138,.15)',.52);glow(x+W*.08,y+H*.04,Math.min(W,H)*.44,'rgba(143,65,157,.10)',.4);
 // The inner solar system falls away through the cockpit glass.
 const scale=lerp(1.05,.12,ease(u));const sr=Math.min(W,H)*.17*scale;
 glow(x,y,sr*5,'rgba(250,151,59,.21)',1);glow(x,y,sr*1.5,'rgba(255,188,102,.84)',.36);
 ctx.fillStyle='#ffe9b2';ctx.beginPath();ctx.arc(x,y,Math.max(2,sr*.42),0,2*Math.PI);ctx.fill();
 for(let i=0;i<5;i++){ctx.save();ctx.translate(x,y);ctx.rotate(-.24);ctx.beginPath();ctx.ellipse(0,0,Math.max(8,(i+1)*sr*.92),Math.max(3,(i+1)*sr*.37),0,0,Math.PI*2);ctx.strokeStyle=`rgba(145,185,220,${.19-i*.018})`;ctx.lineWidth=.85;ctx.setLineDash([4,8]);ctx.stroke();ctx.restore()}
 const planetColors=['#85c9eb','#d2c1a6','#e28f55','#d2b78a'];for(let i=0;i<4;i++){const theta=t*.1*(.3+i*.2)+i*1.2;const rr=(i+1)*sr*.92;ctx.fillStyle=planetColors[i];ctx.beginPath();ctx.arc(x+rr*Math.cos(theta),y+rr*.37*Math.sin(theta),Math.max(.6,2.5*scale),0,2*Math.PI);ctx.fill()}
 ctx.restore()}
function background(t){ctx.fillStyle='#030914';ctx.fillRect(0,0,W,H);const col=ctx.createLinearGradient(0,0,W,H);col.addColorStop(0,'rgba(3,15,32,.55)');col.addColorStop(.63,'rgba(5,9,20,.08)');col.addColorStop(1,'rgba(0,13,30,.25)');ctx.fillStyle=col;ctx.fillRect(0,0,W,H);starfield(t,p*1.4);}
function nearWarp(t,amount){if(reduced||amount<.03)return;ctx.save();ctx.globalAlpha=amount*.44;const cx=W*.72,cy=H*.5;for(let i=0;i<travelDust.length;i++){const d=travelDust[i];const phase=(d.x+t*.07*d.speed)%1;const q=phase*phase;const angle=d.y*Math.PI*2;const len=lerp(3,47,q)*amount;const x=cx+Math.cos(angle)*(38+q*W*.68),y=cy+Math.sin(angle)*(25+q*H*.67);ctx.strokeStyle=`rgba(169,214,253,${.17+q*.61})`;ctx.lineWidth=d.size;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*len,y+Math.sin(angle)*len);ctx.stroke()}ctx.restore()}
function sceneIndex(v){let idx=0;for(let i=1;i<anchors.length;i++)if(v>(anchors[i-1]+anchors[i])*.5)idx=i;return idx}
function sceneCrossfade(v){const n=anchors.length;for(let i=0;i<n-1;i++){const boundary=(anchors[i]+anchors[i+1])*.5;const width=Math.min(.065,(anchors[i+1]-anchors[i])*.24);if(v>=boundary-width&&v<=boundary+width)return{i,j:i+1,mix:ease(clamp((v-(boundary-width))/(width*2)))};}return{i:sceneIndex(v),j:-1,mix:0};}
function relativeStage(i,v){const st=anchors[i],end=i+1<anchors.length?anchors[i+1]:1;return clamp((v-st)/Math.max(.1,end-st));}
function renderScene(i,t,a,v){if(a<=.002)return;const u=relativeStage(i,v);if(i===0)sceneEarth(t,u,a);if(i===1)sceneMoon(t,u,a);if(i===2)sceneMars(t,u,a);if(i===3)sceneSaturn(t,u,a);if(i===4)sceneEscape(t,u,a)}
function paint(t){ctx.setTransform(D,0,0,D,0,0);background(t);const pair=sceneCrossfade(p);renderScene(pair.i,t,1-pair.mix,p);if(pair.j!==-1)renderScene(pair.j,t,pair.mix,p);if(pair.j!==-1)nearWarp(t,Math.sin(Math.PI*pair.mix));else nearWarp(t,0);}
function activate(i){nav.forEach((x,k)=>{x.classList.toggle('active',i===k);if(i===k)x.setAttribute('aria-current','location');else x.removeAttribute('aria-current')});nodes.forEach((x,k)=>x.classList.toggle('selected',i===k));const d=info[i];locationLabel.textContent=d.place;distanceLabel.textContent=d.distance;travelLabel.textContent=d.flight;counter.textContent=String(i+1).padStart(2,'0')+' / 05';document.body.dataset.scene=names[i]}
function onScroll(){target=clamp(scrollY/scrollMax);progressFill.style.height=(target*100).toFixed(2)+'%';activate(sceneIndex(target));for(const s of sections){const y=s.getBoundingClientRect();if(y.top<H*.80&&y.bottom>H*.13){s.classList.add('is-visible');visited.add(s.id)}}if(reduced){p=target;paint(performance.now()*.001)}}
function frame(ms){const dt=Math.min(64,ms-lastFrame||16);lastFrame=ms;const friction=1-Math.exp(-dt/180);p+=(target-p)*friction;if(Math.abs(target-p)<.00002)p=target;mouseX+=(pointerX-mouseX)*.025;mouseY+=(pointerY-mouseY)*.025;paint(ms*.001);raf=requestAnimationFrame(frame)}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',()=>{resize();onScroll()},{passive:true});addEventListener('pointermove',e=>{pointerX=(e.clientX-W/2);pointerY=(e.clientY-H/2)},{passive:true});
nav.forEach(a=>a.addEventListener('click',()=>{}));
const observer=new IntersectionObserver(entries=>{for(let e of entries)if(e.isIntersecting)e.target.classList.add('is-visible')},{threshold:.12,rootMargin:'0px 0px -8% 0px'});sections.forEach(s=>observer.observe(s));
// Start on the correct chapter, including deep links and browser restoration.
resize();onScroll();if(!reduced)raf=requestAnimationFrame(frame);else paint(0);
})();
