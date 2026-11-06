function ellipse(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
function round(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function pet(c,ch,x,y,s=1,car=false,flap=0){c.save();c.translate(x,y);c.scale(s,s);const k=ch.kind;if(ch.costume){seaPet(c,ch,flap);c.restore();return}if(k==='kangaroo'){c.strokeStyle=ch.color;c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(17,24);c.bezierCurveTo(55,19,77,19,77,43);c.stroke();c.strokeStyle='#ffffff';c.lineWidth=12;c.beginPath();c.moveTo(77,43);c.bezierCurveTo(77,69,52,78,39,60);c.stroke()}if(k==='monkey'){c.strokeStyle=ch.color;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-15,25);c.bezierCurveTo(-65,45,-58,-12,-42,-3);c.stroke()}ellipse(c,0,43,42,8,'#183a3720');if(k==='bird'||k==='pineapple'){ellipse(c,0,3,23,30,ch.color);c.save();c.translate(-17,5);c.rotate(-flap);ellipse(c,-12,0,19,9,ch.color);c.restore();c.save();c.translate(17,5);c.rotate(flap);ellipse(c,12,0,19,9,ch.color);c.restore();ellipse(c,0,-23,22,22,ch.color);if(k==='pineapple'){c.fillStyle='#639448';for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*8,-38);c.lineTo(i*18,-65);c.lineTo(i*8+9,-38);c.fill()}}c.fillStyle='#e1a848';c.beginPath();c.moveTo(-6,-18);c.lineTo(6,-18);c.lineTo(0,-7);c.fill();ellipse(c,-10,33,6,4,'#d7a052');ellipse(c,10,33,6,4,'#d7a052')}else{ellipse(c,0,9,27,32,ch.color);ellipse(c,-24,9,10,19,ch.color);ellipse(c,25,6,10,19,ch.color);ellipse(c,-13,37,11,10,ch.color);ellipse(c,13,37,11,10,ch.color);if(k==='kangaroo'){ellipse(c,-14,-43,8,22,ch.color);ellipse(c,14,-43,8,22,ch.color)}else if(k==='koala'||k==='bear'||k==='monkey'){ellipse(c,-24,-28,16,16,ch.color);ellipse(c,24,-28,16,16,ch.color);ellipse(c,-24,-28,10,10,'#f3dbd0');ellipse(c,24,-28,10,10,'#f3dbd0')}ellipse(c,0,-17,29,27,ch.color);if(k==='monkey'){ellipse(c,0,-15,21,18,'#fff3cb');ellipse(c,0,13,15,20,'#ffffff')}if(k==='kangaroo'){ellipse(c,0,11,15,22,'#ffffff');ellipse(c,0,-9,16,10,'#c89b6d')}if(k==='bear'){ellipse(c,-9,7,16,24,'#e6a9bf');ellipse(c,9,13,13,24,'#e5b6a5')}if(k==='sloth'){ellipse(c,0,-18,24,20,'#efe9d8');ellipse(c,-12,-22,10,8,'#655d52');ellipse(c,12,-22,10,8,'#655d52');round(c,-23,4,46,25,8,'#d85c53')}if(k==='fluff'){round(c,-24,-48,48,13,5,'#ce6155');round(c,-19,-67,38,24,10,'#d76b5b')}ellipse(c,0,-7,k==='koala'?7:4,k==='koala'?10:3,'#263f3a');c.strokeStyle='#263f3a';c.lineWidth=2;c.beginPath();c.arc(0,-2,6,0,Math.PI);c.stroke()}ellipse(c,-10,-24,4,5,'#fff9ed');ellipse(c,10,-24,4,5,'#fff9ed');ellipse(c,-9,-23,2,3,'#213d38');ellipse(c,11,-23,2,3,'#213d38');if(car){round(c,-48,12,100,33,14,ch.kind==='sloth'?'#da6859':ch.kind==='fluff'?'#68b7bf':'#c08eb9');round(c,-30,0,55,27,10,ch.kind==='sloth'?'#da6859':'#83c7c6');ellipse(c,-28,44,13,13,'#243c38');ellipse(c,31,44,13,13,'#243c38');ellipse(c,-28,44,6,6,'#e6e3d5');ellipse(c,31,44,6,6,'#e6e3d5');ellipse(c,11,28,11,11,'#fff8e7');c.fillStyle='#28433c';c.font='bold 14px sans-serif';c.fillText('1',7,33)}c.restore();if(ch.friend){const friend={kind:ch.friend==='monkey'?'monkey':'koala',color:ch.friend==='monkey'?'#f3d34f':ch.color};pet(c,friend,x-(ch.friend==='twin'?60:44)*s,y+(ch.friend==='twin'?0:15)*s,s*(ch.friend==='twin'?1:ch.friend==='monkey'?.72:.52),false,flap)}}
function patricia(c,x,y,s=1,t=0,world=0){
 c.save();c.translate(x,y);c.scale(-s,s);
 if(world===2){
  // Feathered wings grow from the bow and flutter with Patricia.
  const flutter=Math.sin(t)*4;
  c.fillStyle='#fffdf5';c.strokeStyle='#c9c3db';c.lineWidth=1.5;
  for(const side of [-1,1]){c.save();c.translate(-7,-34);c.scale(side,1);c.beginPath();c.moveTo(8,0);c.bezierCurveTo(25,-28+flutter,45,-30+flutter,48,-19+flutter);c.lineTo(33,-12);c.lineTo(43,-12);c.bezierCurveTo(34,4,19,9,8,3);c.closePath();c.fill();c.stroke();c.restore()}
 }
 c.fillStyle='#d99bc8';c.beginPath();c.moveTo(0,0);c.arc(0,0,34,.37+Math.sin(t)*.1,Math.PI*2-.37-Math.sin(t)*.1);c.closePath();c.fill();ellipse(c,-1,-17,4,5,'#233e39');
 if(world===1){
  for(const side of [-1,1]){c.save();c.translate(-7,-34);c.scale(side,1);c.fillStyle='#538c48';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(4,-23,27,-23);c.quadraticCurveTo(29,-1,0,0);c.fill();c.strokeStyle='#b4d78d';c.lineWidth=2;c.beginPath();c.moveTo(1,-1);c.lineTo(22,-18);c.stroke();c.restore()}
  ellipse(c,-7,-34,6,6,'#dcdf84');
 }else{
  c.fillStyle='#a36d9d';c.beginPath();c.moveTo(-7,-30);c.lineTo(-25,-47);c.lineTo(-24,-24);c.closePath();c.fill();c.beginPath();c.moveTo(-7,-30);c.lineTo(9,-47);c.lineTo(11,-26);c.closePath();c.fill();ellipse(c,-7,-31,6,6,'#fff0d5');
 }c.restore();
}
function ghost(c,x,y,s=1,t=0){
 c.save();c.translate(x,y+Math.sin(t)*4);c.scale(s,s);c.fillStyle='#f9f5ff';c.strokeStyle='#b5a4cb';c.lineWidth=2;c.beginPath();c.moveTo(-28,28);c.lineTo(-28,-4);c.bezierCurveTo(-28,-42,28,-42,28,-4);c.lineTo(28,28);c.lineTo(14,19);c.lineTo(0,29);c.lineTo(-14,19);c.closePath();c.fill();c.stroke();ellipse(c,-9,-7,5,8,'#584b71');ellipse(c,9,-7,5,8,'#584b71');ellipse(c,0,11,5,7,'#584b71');c.restore();
}
function treetop(c,x,y,s=1){
 round(c,x-8*s,y,16*s,58*s,5*s,'#a27955');
 ellipse(c,x,y,53*s,19*s,'#629b55');ellipse(c,x-25*s,y-6*s,28*s,19*s,'#7eae61');ellipse(c,x+23*s,y-9*s,29*s,20*s,'#8bbd6e');ellipse(c,x,y-13*s,31*s,19*s,'#9ac878');
 c.strokeStyle='#c9e3a0';c.lineWidth=2;c.beginPath();c.moveTo(x-22*s,y-19*s);c.quadraticCurveTo(x,y-28*s,x+23*s,y-19*s);c.stroke();
}
function cloud(c,x,y,s=1){ellipse(c,x,y,40*s,15*s,'#fffaf0');ellipse(c,x-15*s,y-10*s,20*s,18*s,'#fffaf0');ellipse(c,x+12*s,y-14*s,24*s,22*s,'#fffaf0')}
function scene(c,w,h,m=0,offset=0){c.fillStyle=['#c4e5df','#d8e6c3','#c9e7ea'][m];c.fillRect(0,0,w,h);cloud(c,w*.2-offset% (w+180),h*.14,.8);cloud(c,w*.8,h*.22,1);ellipse(c,w*.85,h*.13,28,28,'#f1d38a');if(m<2){for(let i=0;i<5;i++){const x=((i*w/4-offset*.2)%(w+120)+w+120)%(w+120)-60;round(c,x,h*.22,20,h*.55,8,'#a77d59');ellipse(c,x+10,h*.24,65,65,m?'#83ac70':'#97bf7b');ellipse(c,x-15,h*.28,45,45,'#a6c689')}}if(m===0){round(c,0,h*.55,w,h*.45,0,'#354f49');c.strokeStyle='#f4ecd1';c.lineWidth=3;c.setLineDash([24,25]);for(let i=1;i<=2;i++){c.beginPath();c.moveTo(-offset%49,h*(.55+i*.15));c.lineTo(w,h*(.55+i*.15));c.stroke()}c.setLineDash([])}}
function seaPet(c,ch,flap=0){
 const stitch=ch.costume==='stitch',body=stitch?'#70a4d5':'#a1aaa5';
 if(ch.costume==='turtle'){ellipse(c,0,12,38,37,'#477b55');ellipse(c,0,12,28,31,'#98ba64');for(const side of [-1,1])ellipse(c,side*34,22,17,9,'#77aa64')}
 if(ch.costume==='hammerhead'){ellipse(c,0,10,30,39,'#7a9fae');c.fillStyle='#7a9fae';c.beginPath();c.moveTo(20,35);c.lineTo(55,28);c.lineTo(43,49);c.closePath();c.fill();round(c,-47,-36,94,20,9,'#8aafbc');ellipse(c,-39,-28,5,5,'#233e39');ellipse(c,39,-28,5,5,'#233e39')}
 ellipse(c,0,8,23,29,body);ellipse(c,0,14,16,19,stitch?'#b2d0e9':'#dae0db');
 if(stitch){ellipse(c,-29,-18,13,33,'#70a4d5');ellipse(c,29,-18,13,33,'#70a4d5');ellipse(c,-29,-18,7,26,'#d19fbb');ellipse(c,29,-18,7,26,'#d19fbb')}else{ellipse(c,-20,-24,14,14,body);ellipse(c,20,-24,14,14,body)}
 ellipse(c,0,-14,26,25,body);ellipse(c,-9,-17,5,7,'#203e49');ellipse(c,9,-17,5,7,'#203e49');ellipse(c,0,-5,stitch?9:6,6,'#294654');
 if(stitch){round(c,-25,-29,50,22,8,'#d8f7f28a');c.strokeStyle='#f3ca77';c.lineWidth=4;c.strokeRect(-23,-27,46,19);c.beginPath();c.moveTo(24,-8);c.lineTo(32,-8);c.lineTo(32,-47);c.stroke();round(c,26,-52,12,10,4,'#f3ca77')}
 ellipse(c,-13,38,15,7,'#ecbd6d');ellipse(c,13,38,15,7,'#ecbd6d');
}
function oceanPatricia(c,x,y,s,t,costume){
 c.save();c.translate(x,y);c.scale(s,s);
 if(costume==='seahorse'){
  c.strokeStyle='#edaf79';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(12,23);c.bezierCurveTo(55,70,5,77,0,49);c.bezierCurveTo(-4,30,22,34,19,49);c.stroke();ellipse(c,8,4,40,42,'#edaf79');round(c,-53,-5,30,17,7,'#edaf79');
 }else if(costume==='whale'){
  ellipse(c,7,6,51,38,'#739cca');c.fillStyle='#739cca';c.beginPath();c.moveTo(41,7);c.lineTo(72,-11);c.lineTo(65,13);c.lineTo(76,30);c.lineTo(42,22);c.fill();ellipse(c,5,31,23,9,'#bfd8ec');c.strokeStyle='#d1edf0';c.lineWidth=4;c.beginPath();c.moveTo(10,-32);c.quadraticCurveTo(4,-58,-9,-51);c.moveTo(10,-32);c.quadraticCurveTo(20,-58,31,-50);c.stroke();
 }else{
  ellipse(c,5,3,46,40,'#665c89');c.strokeStyle='#a0a6bf';c.lineWidth=3;c.beginPath();c.moveTo(2,-30);c.quadraticCurveTo(-8,-80,-41,-54);c.stroke();ellipse(c,-41,-54,13,13,'#f6e69c44');ellipse(c,-41,-54,7,7,'#fff1aa');c.fillStyle='#665c89';c.beginPath();c.moveTo(40,0);c.lineTo(64,-13);c.lineTo(60,25);c.lineTo(40,18);c.fill();
 }
 patricia(c,-7,-1,.8,t,0);c.restore();
}
