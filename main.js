'use strict';
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
(()=>{
 const panel=document.querySelector('.milkyway-backdrop'),canvas=document.querySelector('.sky-fallback'),photo=document.querySelector('.sky-photo');
 if(!panel||!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const W=1800,H=700;canvas.width=W;canvas.height=H;
 let seed=749207;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 const base=ctx.createLinearGradient(0,0,0,H);base.addColorStop(0,'#03050c');base.addColorStop(.42,'#0a1223');base.addColorStop(.7,'#070c16');base.addColorStop(1,'#010307');ctx.fillStyle=base;ctx.fillRect(0,0,W,H);
 // Wide, textured star-rich Milky Way band viewed from within the disk.
 for(let i=0;i<9500;i++){
   const x=rand()*W;const center=H*(.47+.13*Math.sin((x/W)*Math.PI*2.2-.9));
   const y=center+(rand()+rand()+rand()-1.5)*H*.39;
   const dist=Math.abs((y-center)/H),density=Math.exp(-dist*dist/0.019);
   if(rand()>density*.94+.06)continue;
   const warm=rand(),r=.17+Math.pow(rand(),6)*2.1;ctx.globalAlpha=(.09+rand()*.72)*density;
   ctx.fillStyle=warm<.37?'#eecfa6':warm<.68?'#bacbe9':'#e4eafb';
   ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
 // Soft integrated stellar glow, strongly concentrated around the Galactic plane.
 ctx.globalCompositeOperation='screen';
 for(let i=0;i<410;i++){
   const x=rand()*W,y0=H*(.47+.13*Math.sin((x/W)*Math.PI*2.2-.9));
   const y=y0+(rand()-.5)*170,r=14+rand()*95;
   const g=ctx.createRadialGradient(x,y,0,x,y,r);
   const a=.012+rand()*.024;g.addColorStop(0,'rgba(184,167,146,'+a+')');g.addColorStop(1,'rgba(23,28,50,0)');
   ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 ctx.globalCompositeOperation='source-over';
 // Dark dust silhouettes crossing the luminous band.
 for(let i=0;i<155;i++){
   const x=rand()*W,y0=H*(.47+.13*Math.sin((x/W)*Math.PI*2.2-.9));
   const y=y0+(rand()-.5)*105,rx=22+rand()*135,ry=5+rand()*19;
   ctx.save();ctx.translate(x,y);ctx.rotate((rand()-.5)*.8);ctx.fillStyle='rgba(1,3,8,'+(.08+rand()*.29)+')';ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 // Foreground stars remain sharp against the clouds.
 for(let i=0;i<1400;i++){
   const x=rand()*W,y=rand()*H,r=.25+Math.pow(rand(),12)*2.4;
   ctx.globalAlpha=.25+rand()*.72;ctx.fillStyle=rand()<.25?'#f4daba':'#dce9ff';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
 if(photo){
   const external='https://www.eso.org/public/archives/images/large/eso0932a.jpg';
   photo.addEventListener('error',()=>{
     if(!photo.dataset.remoteTried){photo.dataset.remoteTried='1';photo.src=external}
     else photo.classList.add('failed');
   });
   photo.addEventListener('load',()=>{photo.classList.remove('failed');tick()});
   if(photo.complete && photo.naturalWidth===0) photo.dispatchEvent(new Event('error'));
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0;
 function update(){
   raf=0;
   if(reduced.matches){panel.style.setProperty('--sky-pan','0px');return}
   const viewportWidth=panel.clientWidth,viewportHeight=panel.clientHeight;
   const total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   const progress=Math.max(0,Math.min(1,window.scrollY/total));
   const sourceAspect=photo && photo.naturalWidth>0 ? photo.naturalWidth/photo.naturalHeight : W/H;
   // The actual rendered panorama is its aspect ratio times the viewport height.
   const width=Math.max(viewportWidth,viewportHeight*sourceAspect);
   const overflow=Math.max(0,width-viewportWidth);
   // At top, view the right end of the sky. As the page scrolls, the band moves left -> right.
   panel.style.setProperty('--sky-pan',(-overflow*(1-progress)).toFixed(2)+'px');
 }
 function tick(){if(!raf)raf=requestAnimationFrame(update)}
 update();addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);reduced.addEventListener?.('change',tick);
})();
