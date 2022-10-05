const dot = document.getElementById('dot');
const compStyles = window.getComputedStyle(dot);
let xMov=0;
let yMov=1;
let increment=0.1;
let speedFactor=4;

let pressedThreshold=200;

function step(timestamp) {
	if (speedFactor<diff){
		speedFactor+=0.1;
	} else {
		speedFactor-=0.1;
	}
	//console.log(speedFactor);
	
	let pLeft=(parseFloat(compStyles.getPropertyValue('left')) + (xMov/speedFactor));
	let pTop=(parseFloat(compStyles.getPropertyValue('top')) + (yMov/speedFactor));
	
	if (pLeft<0) {pLeft=0;  /* xMov=xMov*-1; increment+=3.14; */  };
	if (pTop<0) {pTop=0; /* yMov=yMov*-1; increment+=3.14; */ };
	
	if (pLeft>window.innerWidth-10) { pLeft=window.innerWidth-10; /*  xMov=xMov*-1; increment+=3.14; */ };
	if (pTop>window.innerHeight-10) { pTop=window.innerHeight-10; /*  yMov=yMov*-1; increment+=3.14; */ };
	
	
	
	dot.style.left = pLeft + "px";
	dot.style.top = pTop + "px";
	if (rotating){
		increment+=0.05;
		if (speedFactor < 0.6){
			increment+=0.04;
		}
		
		if	(speedFactor < 0.4){
			increment+=0.02;
		}
		
		//console.log(increment);
		xMov=Math.sin(increment);
		yMov=Math.cos(increment);
	}
	window.requestAnimationFrame(step);
	
}

window.requestAnimationFrame(step);
let intervals=[0,0];
let timeout;
let allowed = true;
let rotating = false;
let diff=1;
function triggerDown(e){
	
	if (event.repeat != undefined) {
		allowed = !event.repeat;
	}
	if (!allowed) return;
	allowed = false;
  
  
	//console.log(e);
	timeout=setTimeout(() => {
	  //console.log("rotating");
	  rotating=true;
	}, pressedThreshold)
}

function triggerUp(e){
	
	clearTimeout(timeout);
	if (rotating==false){
		intervals.push(Date.now());
		intervals.shift();
		if (intervals[0] != 0){
			//console.log(intervals);
			diff = ((intervals[1]-intervals[0]) / 700);
			//console.log(speedFactor);

		}
		
	}
	
	allowed = true;
	rotating = false;
}

document.addEventListener("keydown", triggerDown);

document.addEventListener("keyup", triggerUp);

