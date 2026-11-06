'use strict';
const WORLDS=[
 {name:'The road',level:'Easy',duration:120,speed:145,color:'#d8e7b6',description:'Dodge potholes. Reach the glowing tunnel at 2 minutes.'},
 {name:'The trees',level:'Medium',duration:240,speed:158,color:'#bbd8b5',description:'Swing through the treetops. Reach the night forest at 4 minutes.'},
 {name:'The sky',level:'Hard',duration:300,speed:172,color:'#c5e5ee',description:'Flap over cloud gaps. Reach the edge of space at 5 minutes.'},
 {name:'The sea',level:'Endless',duration:Infinity,speed:145,color:'#b6e1dc',description:'Dive deeper, dodge faster, and swim for as long as you can.'}
];
const CHARACTERS=[
 [{name:'Larry',sub:'The laid-back sloth',kind:'sloth',color:'#9eaaa1'},{name:'Gary',sub:'Fluffy racer. Excellent hat.',kind:'fluff',color:'#f2d28a'},{name:'Rainbow',sub:'The tie-dye bear',kind:'bear',color:'#c5a2df'}],
 [{name:'Sky & Mikie',sub:'Brown tree kangaroo + yellow monkey',kind:'kangaroo',color:'#99643e',friend:'monkey'},{name:'Jumbella and Jumbro',sub:'The same-size koala twins',kind:'koala',color:'#a1aaa5',friend:'twin'},{name:'Jumbo & Babybo',sub:'Big brother, little brother',kind:'koala',color:'#a1aaa5',friend:'baby'}],
 [{name:'Blueberry',sub:'The blue budgie',kind:'bird',color:'#68b9dc'},{name:'Pickle',sub:'The green Quaker parrot',kind:'bird',color:'#83b485'},{name:'Pineapple',sub:'The yellow English budgie',kind:'pineapple',color:'#f3d678'}],
 [{name:'Turtle Koala',sub:'A koala in a sea turtle costume',kind:'koala',color:'#a1aaa5',costume:'turtle'},{name:'Hammerhead Koala',sub:'A koala in a hammerhead shark costume',kind:'koala',color:'#a1aaa5',costume:'hammerhead'},{name:'Snorkelling Stitch',sub:'Blue ears, big fins, ready to dive',kind:'stitch',color:'#689fd2',costume:'stitch'}]
];
const ADVENTURES=[['Larry’s Sloth Sprint','Gary’s Fluffy Rally','Rainbow’s Colour Dash'],['Sky & Mikie’s Canopy Swing','Jumbella and Jumbro’s Treetop Trek','Jumbo & Babybo’s Branch Adventure'],['Blueberry’s Cloud Hop','Pickle’s Parrot Flight','Pineapple’s Sky Safari'],['Turtle Koala’s Reef Ramble','Hammerhead Koala’s Deep Dive','Stitch’s Snorkelling Safari']];
const WORLD_TITLES=['The Road Rally','The Treetop Swing','The Cloud Chase','The Deep Sea Dive'];
const GHOSTS={purple:{name:'Purple ghost',color:'#c6a1e8',damage:1,speed:1},yellow:{name:'Yellow ghost',color:'#f7d458',damage:1,speed:2.1},blue:{name:'Blue ghost',color:'#72b9ee',damage:2,speed:.8}};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function timeText(seconds){const s=Math.floor(Math.max(0,seconds));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function platformHop(distance){return Math.sin(((distance%180)+180)%180/180*Math.PI)*36}
class SurvivalGame{
 constructor(world,choices=[0],rng=Math.random){
  this.world=world;this.config=WORLDS[world];this.rng=rng;this.elapsed=0;this.scroll=0;this.countdown=3;this.paused=false;this.over=false;this.celebration=0;this.spawnIn=1.5;this.gapIn=7;this.spawnCount=0;this.eliminationCount=0;this.obstacles=[];this.stars=[];this.events=[];this.lastHud=0;this.seaOutroAt=null;
  const available=[0,1,2].filter(ch=>!choices.includes(ch));
  this.actors=[...choices,...available].map((ch,id)=>({id,ch,human:id<choices.length,player:id<choices.length?id+1:null,lane:[1,0,2][id],visualLane:[1,0,2][id],lives:3,alive:true,finished:false,distance:0,offset:0,score:0,stars:0,collected:0,boost:0,invincible:0,fall:0,deathAt:null,cause:null,thinkIn:.3+id*.11}));
 }
 difficulty(){if(this.world===3)return 1+Math.min(this.elapsed/120,2)+Math.max(0,this.elapsed-240)/60;return 1+this.world+this.elapsed/this.config.duration*.75}
 speed(){return this.config.speed+(this.difficulty()-1)*7}
 costume(){return this.elapsed<120?'seahorse':this.elapsed<240?'whale':'anglerfish'}
 move(id,delta){const a=this.actors[id];if(!a||this.paused||this.over||this.countdown>0||!a.alive||a.finished||a.fall>0)return;a.lane=clamp(a.lane+delta,0,2)}
 addHazard(kind,lane,distance=this.scroll+850){const type=kind==='gap'?'gap':kind==='patricia'?'patricia':'ghost';this.obstacles.push({type,kind,lane,distance,hit:new Set(),speed:type==='gap'?0:(14+this.difficulty()*7)*(GHOSTS[kind]?.speed||1)})}
 spawnWave(){
  const lane=Math.floor(this.rng()*3),kinds=['purple','yellow','purple','blue','yellow','purple','blue','yellow','purple','patricia'];
  this.addHazard(kinds[this.spawnCount++%kinds.length],lane);
  this.stars.push({lane:(lane+1+Math.floor(this.rng()*2))%3,distance:this.scroll+920,hit:new Set()});
 }
 damage(a,o){
  if(o.hit.has(a.id)||!a.alive||a.finished||a.fall>0)return;o.hit.add(a.id);
  if(a.invincible>0&&o.type!=='patricia')return;
  const loss=o.type==='patricia'?a.lives:o.type==='gap'?1:GHOSTS[o.kind].damage;
  a.lives=Math.max(0,a.lives-loss);a.cause=o.type==='ghost'?`${o.kind} ghost`:o.type;a.invincible=1.8;
  a.boost=0;a.stars=0;
  if(o.type==='gap')a.fall=1.6;
  if(a.lives===0){a.alive=false;a.deathAt=this.elapsed;a.eliminationOrder=++this.eliminationCount}
  this.events.push({type:a.alive?'hit':'eliminated',actor:a.id,cause:a.cause,loss});
 }
 ai(a,dt){
  a.thinkIn-=dt;if(a.thinkIn>0)return;a.thinkIn=.22+this.rng()*.24;
  const nearby=this.obstacles.filter(o=>!o.hit.has(a.id)&&o.distance>a.distance-15&&o.distance<a.distance+170);
  if(nearby.some(o=>o.lane===a.lane)&&this.rng()<.78){
   const safe=[0,1,2].filter(l=>!nearby.some(o=>o.lane===l));if(safe.length)a.lane=safe[Math.floor(this.rng()*safe.length)];
  }else if(this.rng()<.2){const star=this.stars.find(s=>!s.hit.has(a.id)&&s.distance>a.distance&&s.distance-a.distance<150&&!nearby.some(o=>o.lane===s.lane));if(star)a.lane=star.lane}
 }
 rank(){return [...this.actors].sort((a,b)=>Number(b.finished)-Number(a.finished)||Number(b.alive)-Number(a.alive)||(a.alive?b.score-a.score:(b.deathAt||0)-(a.deathAt||0)||(b.eliminationOrder||0)-(a.eliminationOrder||0))||a.id-b.id)}
 step(dt){
  if(this.paused||this.over)return;
  if(this.countdown>0){this.countdown=Math.max(0,this.countdown-dt);return}
  if(this.celebration>0){this.celebration-=dt;if(this.celebration<=0)this.over=true;return}
  dt=Math.min(dt,.05);if(Number.isFinite(this.config.duration))dt=Math.min(dt,this.config.duration-this.elapsed);
  this.elapsed+=dt;
  // End endless spectating only after every human is out; living friends keep playing.
  if(this.world===3&&this.actors.filter(a=>a.human).every(a=>!a.alive)){
   if(this.seaOutroAt===null||this.seaOutroAt===undefined)this.seaOutroAt=this.elapsed;
   const computers=this.actors.filter(a=>!a.human);
   computers.forEach((a,i)=>{if(a.alive&&this.elapsed-this.seaOutroAt>=3+i*2)this.damage(a,{type:'patricia',hit:new Set()})});
  }
  const worldSpeed=this.speed();this.scroll+=worldSpeed*dt;this.spawnIn-=dt;this.gapIn-=dt;
  if(this.spawnIn<=0){this.spawnIn=Math.max(.7,3.3-this.difficulty()*.38);this.spawnWave()}
  if(this.world<3&&this.gapIn<=0){this.gapIn=Math.max(3.2,8-this.difficulty());const lane=Math.floor(this.rng()*3);if(!this.obstacles.some(o=>o.distance>this.scroll+680&&o.distance<this.scroll+1020&&o.lane!==lane))this.addHazard('gap',lane)}
  for(const o of this.obstacles){o.previous=o.distance;o.distance-=o.speed*dt}
  for(const a of this.actors){
   a.fall=Math.max(0,a.fall-dt);a.invincible=Math.max(0,a.invincible-dt);
   if(!a.alive||a.finished)continue;
   a.boost=Math.max(0,a.boost-dt);a.stars=Math.ceil(a.boost/4);
   if(a.fall>0)continue;
   if(!a.human)this.ai(a,dt);
   a.visualLane+=(a.lane-a.visualLane)*Math.min(1,dt*11);
   const boosted=a.boost>0,extra=boosted?worldSpeed*.34:0;
   a.score+=(worldSpeed+extra)*dt;
   a.offset=clamp(a.offset+(boosted?22:-a.offset*.5)*dt,-55,65);
   const prev=a.distance;a.distance=this.scroll+a.offset;
   for(const o of this.obstacles){
    const before=prev-(o.previous??o.distance),after=a.distance-o.distance;
    if(before<27&&after>=-27&&Math.abs(a.visualLane-o.lane)<.4)this.damage(a,o);
    if(!a.alive||a.fall>0)break;
   }
   if(!a.alive||a.fall>0)continue;
   for(const star of this.stars){if(!star.hit.has(a.id)&&prev<star.distance+25&&a.distance>=star.distance-25&&Math.abs(a.visualLane-star.lane)<.4){star.hit.add(a.id);a.boost=Math.min(12,a.boost+4);a.stars=Math.ceil(a.boost/4);a.collected++;this.events.push({type:'star',actor:a.id})}}
  }
  this.obstacles=this.obstacles.filter(o=>o.distance>this.scroll-200);this.stars=this.stars.filter(s=>s.distance>this.scroll-200);
  if(this.actors.every(a=>!a.alive&&a.fall<=0)){this.over=true;return}
  if(Number.isFinite(this.config.duration)&&this.elapsed>=this.config.duration){
   for(const a of this.actors){if(a.alive){a.finished=true;a.finishTime=this.elapsed;this.events.push({type:'finish',actor:a.id})}}
   this.celebration=4;
  }
 }
}
