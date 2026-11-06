'use strict';
function blend(a,b,t){const n=x=>parseInt(x,16);return '#'+[1,3,5].map(i=>Math.round(n(a.slice(i,i+2))*(1-t)+n(b.slice(i,i+2))*t).toString(16).padStart(2,'0')).join('')}
function textAt(c,text,x,y,size=15,color='#183a37',align='left'){c.fillStyle=color;c.font=`bold ${size}px "DM Sans",sans-serif`;c.textAlign=align;c.fillText(text,x,y);c.textAlign='left'}
function backdrop(c,w,h,g){
 const m=g.world,t=g.elapsed,scroll=g.scroll;
 const dark=m===0?clamp((t-100)/20,0,1):m===1?clamp(t/240,0,1):m===2?clamp(t/300,0,1):clamp(t/420,0,.96);
 const day=['#b9dfd5','#c6e3c7','#b7dfe9','#69c5ce'][m],night=['#182e35','#172c42','#10162c','#071b36'][m];
 const gradient=c.createLinearGradient(0,0,0,h);gradient.addColorStop(0,blend(day,night,dark));gradient.addColorStop(1,blend(m===3?'#3696b0':'#e4eacb',night,dark*.85));c.fillStyle=gradient;c.fillRect(0,0,w,h);
 if(m!==3){for(let i=0;i<3;i++)cloud(c,((i*w*.48-scroll*.08)%(w+180)+w+180)%(w+180)-80,h*(.1+i*.045),.9);ellipse(c,w*.85,h*.15,26,26,dark>.6?'#fff5cb':'#f5d383')}
 if((m===1||m===2)&&dark>.3){c.globalAlpha=(dark-.3)/.7;for(let i=0;i<42;i++)ellipse(c,(i*137+71)%w,(i*67+17)%(h*.37),i%4===0?2:1,1.5,'#fff3ce');c.globalAlpha=1}
 if(m===0){
  for(let i=0;i<7;i++){const x=((i*200-scroll*.25)%(w+200)+w+200)%(w+200)-100;round(c,x,h*.14,14,h*.3,4,'#a1845c');ellipse(c,x,h*.15,49,49,'#93b97b')}
  if(dark>0){c.globalAlpha=dark;round(c,0,0,w,h,0,'#182e35');c.strokeStyle='#587071';c.lineWidth=16;for(let x=-scroll%180;x<w+180;x+=180){c.beginPath();c.moveTo(x,h);c.lineTo(x,70);c.quadraticCurveTo(x+85,-10,x+170,70);c.stroke();round(c,x+73,30,32,10,4,'#fff0b0');ellipse(c,x+90,55,65,30,'#ffdf8510')}c.globalAlpha=1}
 }
 if(m===1){
  const water=h*.92;c.fillStyle=blend('#55adbd','#183854',dark);c.fillRect(0,water,w,h-water);c.strokeStyle='#c1e4e966';c.lineWidth=2;for(let x=-scroll*.4%75;x<w;x+=75){c.beginPath();c.moveTo(x,water+12);c.quadraticCurveTo(x+18,water+3,x+36,water+12);c.stroke()}
 }
 if(m===3){for(let i=0;i<24;i++){const x=(i*173-scroll*.12+w*20)%w,y=(h-i*63-t*13)%(h+80);c.strokeStyle='#d8ffff55';c.lineWidth=1.5;c.beginPath();c.arc(x,y<0?y+h:y,3+i%5,0,Math.PI*2);c.stroke()}for(let i=0;i<8;i++){const x=(i*w/7-scroll*.1+w*50)%(w+80);c.strokeStyle=blend('#4f9c89','#174554',dark);c.lineWidth=9;c.beginPath();c.moveTo(x,h);c.bezierCurveTo(x-35,h-55,x+40,h-90,x,h-130);c.stroke()}}
 return dark;
}
function drawRace(c,w,h,g,confetti,viewId=0){
 const mobile=w<750,m=g.world,dark=backdrop(c,w,h,g),scale=mobile?.58:.9;
 const top=h*.35,lh=h*.185,base=w*.22,px=d=>base+(d-g.scroll)*scale,ground=l=>top+l*lh+lh*.6;
 for(let lane=0;lane<3;lane++){
  if(m===0){round(c,0,top+lane*lh,w,lh-3,0,'#334a47');c.strokeStyle='#fff4c988';c.lineWidth=2;c.setLineDash([22,30]);c.beginPath();c.moveTo(-g.scroll%52,top+(lane+1)*lh-3);c.lineTo(w,top+(lane+1)*lh-3);c.stroke();c.setLineDash([])}
  else if(m===3){round(c,0,top+lane*lh,w,lh-2,12,'#e6ffff0a')}
  else{
   const first=Math.floor((g.scroll-base/scale)/180)-1,last=Math.ceil((g.scroll+(w-base)/scale)/180)+1;
   for(let step=first;step<=last;step++){
    const d=step*180;if(g.obstacles.some(o=>o.type==='gap'&&o.lane===lane&&Math.abs(d-o.distance)<100))continue;
    if(m===1)treetop(c,px(d),ground(lane)+29,mobile?.85:1.05);else cloud(c,px(d),ground(lane)+23,mobile?.95:1.15);
   }
  }
 }
 for(const o of g.obstacles){
  const x=px(o.distance),y=ground(o.lane)-7;if(x< -100||x>w+100)continue;
  if(o.type==='gap'){
   if(m===0){ellipse(c,x,y+18,40,16,'#bd9a6c');ellipse(c,x,y+18,33,12,'#132724');c.strokeStyle='#c4cbb2';c.lineWidth=2;c.beginPath();c.moveTo(x-30,y+8);c.lineTo(x-48,y-3);c.moveTo(x+20,y+5);c.lineTo(x+43,y-6);c.stroke()}
   textAt(c,'!',x,y-45,23,'#f1b973','center');
  }else if(o.type==='ghost'){
   c.save();c.translate(x,y+Math.sin(g.elapsed*5+o.lane)*4);const sc=mobile?.8:1;c.scale(sc,sc);c.fillStyle=GHOSTS[o.kind].color;c.strokeStyle='#53616c';c.lineWidth=1.4;c.beginPath();c.moveTo(-27,25);c.lineTo(-27,-5);c.bezierCurveTo(-27,-43,27,-43,27,-5);c.lineTo(27,25);c.lineTo(13,17);c.lineTo(0,26);c.lineTo(-13,17);c.closePath();c.fill();c.stroke();ellipse(c,-9,-9,5,7,'#263c4a');ellipse(c,9,-9,5,7,'#263c4a');ellipse(c,0,7,5,6,'#263c4a');textAt(c,o.kind==='blue'?'−2':o.kind==='yellow'?'»':'−1',0,22,11,'#263c4a','center');c.restore();
  }else if(m===3)oceanPatricia(c,x,y,mobile?.8:1,g.elapsed*6,g.costume());else patricia(c,x,y,mobile?.8:1,g.elapsed*6,m);
 }
 for(const star of g.stars){if(star.hit.has(viewId))continue;const x=px(star.distance);if(x>-20&&x<w+20)textAt(c,'★',x,ground(star.lane),30,'#f8d366','center')}
 const remaining=g.config.duration-g.elapsed;
 if(Number.isFinite(remaining)&&remaining<5){const x=base+Math.max(0,remaining)*120;for(let row=0;row<15;row++)for(let col=0;col<2;col++)round(c,x+col*12,top+row*lh/5,12,lh/5,0,(row+col)%2?'#fff9ed':'#183a37');textAt(c,'FINISH',x+12,top-12,14,'#fff4d5','center')}
 for(const a of [...g.actors].reverse()){
  if(!a.alive&&a.fall<=0)continue;
  const sc=mobile?.64:.78,x=px(g.scroll+a.offset)+(a.finished?(4-g.celebration)*70:0),hop=(m===1||m===2)?platformHop(a.distance):0;
  let y=ground(a.visualLane)-33-hop;
  let fallProgress=0;
  if(a.fall>0){fallProgress=1-a.fall/1.6;y+=(m===0?38:m===1?h*.98-ground(a.visualLane)+33:h+100-ground(a.visualLane))*fallProgress;}
  if(m===1&&a.fall<=0){c.strokeStyle=dark>.5?'#8da375':'#597742';c.lineWidth=3;const sway=Math.sin(a.distance/180*Math.PI)*22;c.beginPath();c.moveTo(x+sway,top*.1);c.quadraticCurveTo(x+sway,y-45,x,y-15);c.stroke()}
  c.save();if(a.fall>0)c.globalAlpha=1-fallProgress*.8;else if(a.invincible>0)c.globalAlpha=Math.floor(g.elapsed*12)%2?.4:1;
  pet(c,CHARACTERS[m][a.ch],x,y,sc*(m===0&&a.fall>0?Math.max(.05,1-fallProgress):1),m===0,m===2?Math.sin(g.elapsed*(a.fall>0?24:14))*1.1:m===3?Math.sin(g.elapsed*8)*.5:0);c.restore();
  if(a.fall>0&&m===1&&fallProgress>.65){for(let i=0;i<5;i++)ellipse(c,x+(i-2)*12,h*.92-16-Math.sin(i+fallProgress*5)*12,3,7,'#c4f4ef')}
  if(a.fall<=0){round(c,x-29,y-58,58,19,9,a.human?'#183a37':'#fff8e8');textAt(c,a.human?'P'+a.player:'CPU',x,y-45,10,a.human?'#fff8e8':'#183a37','center');textAt(c,'♥'.repeat(a.lives),x,y+43,12,'#dc7796','center');if(a.boost>0)textAt(c,'✦',x-43,y,24,'#ffcf57','center')}
 }
 if(g.countdown>0){round(c,0,0,w,h,0,'#173b3750');textAt(c,String(Math.ceil(g.countdown)),w/2,h*.48,86,'#fff9e9','center');textAt(c,'Three lives. One big adventure.',w/2,h*.48+40,mobile?16:20,'#fff9e9','center')}
 if(g.celebration>0){round(c,w*.12,25,w*.76,65,18,'#fff8e8ee');textAt(c,m===0?'You reached the glowing tunnel!':m===1?'You reached the night forest!':'You reached the edge of space!',w/2,64,mobile?17:23,'#183a37','center')}
 for(const p of confetti){c.save();c.translate(p.x*w,p.y*h);c.rotate(p.angle);round(c,-3,-5,6,10,1,p.color);c.restore()}
}
