'use strict';
const year=document.getElementById('year');
if(year)year.textContent=new Date().getFullYear();
const sky=document.querySelector('.sky-panel');
const root=document.documentElement;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
function updateSky(){
  queued=false;
  if(!sky||reduceMotion.matches)return;
  const rect=sky.getBoundingClientRect();
  const height=innerHeight||document.documentElement.clientHeight;
  const p=Math.max(0,Math.min(1,(height-rect.top)/(height+rect.height)));
  root.style.setProperty('--sky-x',(12+p*76).toFixed(2)+'%');
  root.style.setProperty('--sky-y',(48-p*6).toFixed(2)+'%');
  root.style.setProperty('--sky-tilt',(-1.8+p*3.6).toFixed(2)+'deg');
}
function queueSky(){if(!queued){queued=true;requestAnimationFrame(updateSky)}}
queueSky();
addEventListener('scroll',queueSky,{passive:true});
addEventListener('resize',queueSky);
