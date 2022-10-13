const dot = document.getElementById('dot');
const compStyles = window.getComputedStyle(dot);
let xMov=1;
let yMov=0;
let increment=0.1;
let speedFactor=6;

let pressedThreshold=200;

const now = Tone.now()
const startValue=220;
const osc = new Tone.Oscillator();//.toDestination();

const sampler = new Tone.Sampler({
			urls: {
				A0: "A0.mp3",
				C1: "C1.mp3",
				"D#1": "Ds1.mp3",
				"F#1": "Fs1.mp3",
				A1: "A1.mp3",
				C2: "C2.mp3",
				"D#2": "Ds2.mp3",
				"F#2": "Fs2.mp3",
				A2: "A2.mp3",
				C3: "C3.mp3",
				"D#3": "Ds3.mp3",
				"F#3": "Fs3.mp3",
				A3: "A3.mp3",
				C4: "C4.mp3",
				"D#4": "Ds4.mp3",
				"F#4": "Fs4.mp3",
				A4: "A4.mp3",
				C5: "C5.mp3",
				"D#5": "Ds5.mp3",
				"F#5": "Fs5.mp3",
				A5: "A5.mp3",
				C6: "C6.mp3",
				"D#6": "Ds6.mp3",
				"F#6": "Fs6.mp3",
				A6: "A6.mp3",
				C7: "C7.mp3",
				"D#7": "Ds7.mp3",
				"F#7": "Fs7.mp3",
				A7: "A7.mp3",
				C8: "C8.mp3"
			},
			release: 1,
			onload: activateSound,
			baseUrl: "https://tonejs.github.io/audio/salamander/"
});

soundRtmBool=false;
function activateSound(){
	soundRtmBool=true;
}
//osc.frequency.value = startValue;

const panner = new Tone.Panner(0).toDestination();
const pianoPanner = new Tone.Panner(-1).toDestination();
var rtmDiff=600;

//sampler.connect(pianoPanner).triggerAttackRelease([464], 0.1);
var timeRtm=0;
var rotatingIncrement=0;
function step(timestamp) {
	
	//console.log(timestamp);
	

	if (speedFactor<diff){
		speedFactor+=Math.abs((Math.abs(speedFactor)-Math.abs(diff))/500);
	} else {
		speedFactor-=Math.abs((Math.abs(speedFactor)-Math.abs(diff))/5);
	}
	//console.log(speedFactor);
	
	let pLeft=(parseFloat(compStyles.getPropertyValue('left')) + (xMov/speedFactor));
	let pTop=(parseFloat(compStyles.getPropertyValue('top')) + (yMov/speedFactor));
	
	if (pLeft<10) {pLeft=10;  /* xMov=xMov*-1; increment+=3.14; */  };
	if (pTop<10) {pTop=10; /* yMov=yMov*-1; increment+=3.14; */ };
	
	if (pLeft>window.innerWidth-30) { pLeft=window.innerWidth-30; /*  xMov=xMov*-1; increment+=3.14; */ };
	if (pTop>window.innerHeight-30) { pTop=window.innerHeight-30; /*  yMov=yMov*-1; increment+=3.14; */ };
	
	
	if ((timestamp-timeRtm)>rtmDiff && soundRtmBool && rotating==false) {
		
		rtmPanner=((2/window.innerWidth)*pLeft)-1;
		//console.log(rtmPanner);
		
		rtmTone=Math.abs(pTop-window.innerHeight)+200;
		//console.log(rtmTone);
		
		pianoPanner.pan.rampTo(rtmPanner, now);
		sampler.connect(pianoPanner).triggerAttackRelease([rtmTone], 0.1);
		
		//console.log(rtmDiff);
		timeRtm=timestamp;
	}
	
	
	
	
	
	dot.style.left = pLeft + "px";
	dot.style.top = pTop + "px";
	if (rotating){
		
		rotatingIncrement+=0.001;
		
		if (rotatingIncrement > 0.035){
			rotatingIncrement=0.035;
		}
		
		console.log(rotatingIncrement);
		
		if (contrary){
			increment-=rotatingIncrement;
		} else {
			increment+=rotatingIncrement;
		}
		
		if (diff < 2){
			diff+=15;
		}
		
		
		//console.log(diff);
		
		//console.log(increment);
		//xMov=Math.sin(increment);
		//yMov=Math.cos(increment);
		
		yMov=Math.sin(increment);
		xMov=Math.cos(increment);
		
		var angle=parseInt((Math.atan2(yMov, xMov) * (180/Math.PI))) - 135;
		
		
		dot.style.transform = "rotate("+angle+"deg)";
		
		var sonicAngle=Math.abs(parseInt((Math.atan2(xMov, yMov) * (180/Math.PI))));
		var sonicPanner=parseFloat((Math.atan(xMov, yMov) * (180/Math.PI)))/45;
		//console.log(sonicPanner);
		
		//if (sonicPanner>0) { sonicPanner=1; } else {sonicPanner=-1;}
		
		panner.pan.rampTo(sonicPanner, now);
		osc.connect(panner).frequency.rampTo(parseInt(startValue+sonicAngle), now);
		
	} else {
		rotatingIncrement=0;
	}
	window.requestAnimationFrame(step);
	
}


let intervals=[0,0];
let timeout;
let timeout2;
let allowed = true;
let rotating = false;
let diff=1;
let oldDiff=0.1;
let oldSpeedFactor;
let dateFirstUp=1000;
let contrary=false;
let contraryValueRtmDiff;
let contraryValyeDiff;
let contraryTrueCount=0;

window.requestAnimationFrame(step);
function triggerDown(e){
	
	if (event.repeat != undefined) {
		allowed = !event.repeat;
	}
	if (!allowed) return;
	allowed = false;
  
  

	
	

  
	//console.log(e);
	timeout=setTimeout(() => {
		
		if ((Date.now() - dateFirstUp) < (pressedThreshold+pressedThreshold)){
			contrary=true;
			//contraryTrueCount++;
			
			diff=preDiff;
			rtmDiff=preRtmDiff;
			
		} else {
			contrary=false;
			//contraryTrueCount=0;
			
		}
		
		console.log(contraryTrueCount);
		

		
		//console.log("rotating");
		rotating=true;
		oldDiff=diff;
		oldSpeedFactor=speedFactor;
		osc.start();
		

		
		//console.log(oldDiff);
	}, pressedThreshold)
}

var rtmDiffArr=[0,0];
var diffArr=[0,0];

var preRtmDiff=0;
var preDiff=0;

function triggerUp(e){
	

	
	dateFirstUp=Date.now();
	clearTimeout(timeout);

		
	preRtmDiff=rtmDiff;
	preDiff=diff;
		
	if (rotating==false){
		intervals.push(Date.now());
		intervals.shift();
		if (intervals[0] != 0){
			//console.log(intervals);
				
			rtmDiff = (intervals[1]-intervals[0]);
			diff = rtmDiff/1000;
				

			//console.log(speedFactor);

		}
	} else {
		diff=oldDiff;
		//console.log("set old speed factor")
	}
		
	allowed = true;
	rotating = false;
	osc.stop();

	
}

document.addEventListener("keydown", triggerDown);

document.addEventListener("keyup", triggerUp);

