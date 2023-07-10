if(typeof window==="undefined")
  var {createCanvas}=require('canvas'), crypto=require('node:crypto').webcrypto;
else{
  function createCanvas(width,height){
    let canvas=document.createElement('canvas')
    canvas.height=height;
    canvas.width=width;
    canvas.style.padding="0px";
    return canvas;
  }
  crypto=window.crypto;
}

function handleBlock(X,Y,{N,E,S,W},{ctx,s,l,f}){
  let posX=(X*(l+s))+f,  posY=(Y*(l+s))+f
  //in terms of col and row, X is col, Y is row
  ctx.beginPath()
  if(N)  (ctx.moveTo(posX-f, posY),  ctx.lineTo(posX+s+l+f, posY));
  if(S)  (ctx.moveTo(posX-f, posY+s+l),  ctx.lineTo(posX+s+l+f, posY+s+l));
  if(E)  (ctx.moveTo(posX+s+l, posY-f),  ctx.lineTo(posX+s+l, posY+l+s-l+f));
  if(W)  (ctx.moveTo(posX, posY-f),  ctx.lineTo(posX, posY+l+s-l+f));
  ctx.lineWidth=l
  ctx.stroke()
}
function fillBlock(X,Y,{ctx,s,l,f},fillStyle){
  let posX=s*X+(l*(X+1)), posY=s*Y+(2*(Y+1))
  ctx.fillStyle=fillStyle;
  ctx.fillRect(posX,posY,s,s);
  ctx.stroke();
}


function N(map,px,py,backup){
  if(backup && py>0 && !map[px][py-1].touched)
    return  (map.paths++, map[px][py].N=!1, map[px][py-1].S=!1, true);
  return  py>0 && !map[px][py].N && !map[px][py-1].S && !map[px][py-1].touched;
}
function E(map,px,py,backup){
  if(backup && px<map.height-1 && !map[px+1][py].touched)
    return  (map.paths++, map[px][py].E=!1, map[px+1][py].W=!1, true);
  return  px<map.height-1 && !map[px][py].N && !map[px+1][py].W && !map[px+1][py].touched;
}
function S(map,px,py,backup){
  if(backup && py<map.width-1 && !map[px][py+1].touched)
    return  (map.paths++, map[px][py].S=!1, map[px][py+1].N=!1, true);
  return  py<map.width-1 && !map[px][py].N && !map[px][py+1].N && !map[px][py+1].touched;
}
function W(map,px,py,backup){
  if(backup && px>0 && !map[px-1][py].touched)
    return  (map.paths++, map[px][py].W=!1, map[px-1][py].E=!1, true);
  return  px>0 && !map[px][py].N && !map[px-1][py].E && !map[px-1][py].touched;
}
let precedence={
  N:function(map,px,py,gx,gy,directions){
    if(directions) if(directions.N)  traverseMaze(px,py-1,gx,gy,'S',map);
    else if(map.paths<1 && N(map,px,py,true))  traverseMaze(px,py-1,gx,gy,'S',map);
  },
  E:function(map,px,py,gx,gy,directions){
    if(directions) if(directions.E)  traverseMaze(px+1,py,gx,gy,'W',map);
    else if(map.paths<1 && E(map,px,py,true))  traverseMaze(px+1,py,gx,gy,'W',map);
  },
  S:function(map,px,py,gx,gy,directions){
    if(directions) if(directions.S)  traverseMaze(px,py+1,gx,gy,'N',map);
    else if(map.paths<1 && S(map,px,py,true))  traverseMaze(px,py+1,gx,gy,'N',map);
  },
  W:function(map,px,py,gx,gy,directions){
    if(directions) if(directions.W)  traverseMaze(px-1,py,gx,gy,'E',map);
    else if(map.paths<1 && W(map,px,py,true))  traverseMaze(px-1,py,gx,gy,'E',map);
  }
}
let distance=(x1,y1,x2,y2)=>Math.sqrt(  Math.pow(x2-x1,2) + Math.pow(y2-y1,2)  );
let sorter=(a,b)=>a[1]-b[1];
let notSorter=(a,b)=>b[1]-a[1];
//let notSorter=(a,b)=>(random()%3)-1;
function getPrecedence(map,px,py,gx,gy){
  let {numerator:n,denominator:d}=map.ODDS
  return [
    ['N',distance(gx,gy,px,py-1)],
    ['E',distance(gx,gy,px+1,py)],
    ['S',distance(gx,gy,px,py+1)],
    ['W',distance(gx,gy,px-1,py)]
  ]
  .sort(chance(n,d)? sorter: notSorter);
}


function traverseMaze(px,py,gx,gy,last,map){
  //p as in current position, g as in goal position
  map.paths--; //preventing ONE path from adding each level in
  let firstCall=typeof last!=="string";
  if(map[px][py].touched) return;
  map[px][py].touched=true;
  
  let {numerator:n,denominator:d}=map.ODDS
  let directions={
    N: N(map,px,py)? chance(n,d): false,
    E: E(map,px,py)? chance(n,d): false,
    S: S(map,px,py)? chance(n,d): false,
    W: W(map,px,py)? chance(n,d): false
  }
  if(last!=='N') map.paths += directions.N;
  if(last!=='E') map.paths += directions.E;
  if(last!=='S') map.paths += directions.S;
  if(last!=='W') map.paths += directions.W;
  
  map[px][py].N = !directions.N;
  map[px][py].E = !directions.E;
  map[px][py].S = !directions.S;
  map[px][py].W = !directions.W;
  if(last!==undefined)
    (directions[last]=!1, map[px][py][last]=!1); //never block behind u
  
  const order=getPrecedence(map,px,py,gx,gy); //ordered recursion based on which direction is closer to the goal
  for(let i=0;i<4;i++) precedence[order[i][0]](map,px,py,gx,gy,directions); //move in space if open AND untouched
  for(let i=0;i<4;i++) precedence[order[i][0]](map,px,py,gx,gy); //OPEN and move in space if untouched
  
  if(N(map,px,py,true))  traverseMaze(px,py-1,gx,gy,'S',map);
  if(E(map,px,py,true))  traverseMaze(px+1,py,gx,gy,'W',map);
  if(S(map,px,py,true))  traverseMaze(px,py+1,gx,gy,'N',map);
  if(W(map,px,py,true))  traverseMaze(px-1,py,gx,gy,'E',map);
  
  if(firstCall){
    for(let i=0;i<map.height;i++)
      for(let j=0;j<map.width;j++) handleBlock(i,j,map[i][j],map.DRAW);
    map.start=[gx,gy];
    map.end=[px,py];
    return map;
  }
}
let random=()=>crypto.getRandomValues(new Uint32Array(1))[0];
let range=(min,max)=>(random()%((max+1)-min))+min;
let chance=(n,d)=>random()%d<n;
function newMap(height,width,DRAW,ODDS,canvas){
  //height-width switcharoo is intentional, making rows represent Y and columns represent X
  let grid={paths:1, height, width, DRAW, ODDS, canvas, __proto__:null};
  for(let i=0;i<height;i++){
    grid[i]={__proto__:null};
    for(let j=0;j<width;j++) //false means no wall
      grid[i][j]={N:!1, E:!1, S:!1, W:!1, touched:!1, __proto__:null};
  }
  return grid;
}



function makeMaze(width=20, height=20, start=[0,0], end=[19,19], odds=[2,11], lineWidth=2, space=30, startColour="#FF7F00", endColour="#00F7FF"){
  let WIDTH = (lineWidth*(width+1))+(space*width);
  let HEIGHT = (lineWidth*(height+1))+(space*height);
  let canvas=createCanvas(WIDTH, HEIGHT), ctx=canvas.getContext('2d');
  const DRAW = {s:space, l:lineWidth, f:lineWidth/2, ctx, __proto__:null};
  const ODDS = {numerator:odds[0], denominator:odds[1], __proto__:null};
  
  let map = newMap(width,height,DRAW,ODDS,canvas);
  let [px,py]=end, [gx,gy]=start;
  fillBlock(px,py,DRAW,endColour);
  fillBlock(gx,gy,DRAW,startColour);
  return traverseMaze(px,py,gx,gy,null,map);
}
function makeRandomMaze(maxSize=25,minSize=10,minDist=5,highestOdds=0.9,lowestOdds=0.1){
  let height=range(minSize,maxSize)
  let width=range(minSize,maxSize)
  let startX, startY, endX, endY;
  do{
    (startX=random()%width, endX=random()%width);
    (startY=random()%height, endY=random()%height);
  }while(distance(startX,startY,endX,endY)<minDist);
  
  do{
    var denominator=range(1,50), numerator=range(1,denominator-1);
  }while(numerator/denominator<lowestOdds || numerator/denominator>highestOdds);
  return makeMaze(width,height,[startX,startY],[endX,endY],[numerator,denominator]);
}
const movements={
  N:(pos,map)=>
    pos[1]>0 && !map[pos[0]][pos[1]].N && !map[pos[0]][pos[1]-1].S? pos[1]--: 'break',
  E:(pos,map)=>
    pos[0]<map.height-1 && !map[pos[0]][pos[1]].E && !map[pos[0]+1][pos[1]].W? pos[0]++: 'break',
  S:(pos,map)=>
    pos[1]<map.width-1 && !map[pos[0]][pos[1]].S && !map[pos[0]][pos[1]+1].N? pos[1]++: 'break',
  W:(pos,map)=>
    pos[0]>0 && !map[pos[0]][pos[1]].W && !map[pos[0]-1][pos[1]].E? pos[0]--: 'break',
  __proto__:null
}
function makeMove(map,move='',start){
  start=start||Array.from(map.start);
  if(move.length>map.height*map.width) return start;
  for(let i=0;i<move.length;i++){
    if(!movements[move[i]]) break;
    if(movements[move[i]](start,map)==='break') break;
  }
  return start;
}
if(typeof window==="undefined") module.exports={makeMaze,makeMove,makeRandomMaze};
