

//const dot = document.getElementById('dot');
//const target = document.getElementById('target');
//const compStyles = window.getComputedStyle(dot);
let xMov=0;
let yMov=1;
let increment=0.1;
let speedFactor=6;

let pressedThreshold=200;

const now = Tone.now()
const startValue=220;
const osc = new Tone.Oscillator();//.toDestination();




function drawCircle(x, y, r, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawAngledLine(x, y, length, angle, ctx) {
    var radians = angle / 180 * Math.PI;
    var endX = x + length * Math.cos(radians);
    var endY = y - length * Math.sin(radians);
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}
var RADIUS = 40;
function splitCircle(name, split){
	var c = document.getElementById(name);
	var ctx = c.getContext("2d");
	ctx.strokeStyle = "white";
	ctx.clearRect(0, 0, 1000, 1000);
	//drawCircle(50, 50, RADIUS, ctx);
	
	for (let i = 0; i < split; i++) {
	  drawAngledLine(50, 50, RADIUS, (i * (360 / split)) + 90, ctx);
	}
	

	
}

document.getElementById("btn-one-left").ontouchstart = function(){ setRtm("leftCanvas", 1); resetAllButton("btnLeft"); document.getElementById("btn-one-left").style.background="#efefef"; };
document.getElementById("btn-two-left").ontouchstart = function(){ setRtm("leftCanvas", 2); resetAllButton("btnLeft"); document.getElementById("btn-two-left").style.background="#efefef"; };
document.getElementById("btn-three-left").ontouchstart = function(){ setRtm("leftCanvas", 3); resetAllButton("btnLeft"); document.getElementById("btn-three-left").style.background="#efefef"; };
document.getElementById("btn-four-left").ontouchstart = function(){ setRtm("leftCanvas", 4); resetAllButton("btnLeft"); document.getElementById("btn-four-left").style.background="#efefef"; };
document.getElementById("btn-five-left").ontouchstart = function(){ setRtm("leftCanvas", 5); resetAllButton("btnLeft"); document.getElementById("btn-five-left").style.background="#efefef"; };

document.getElementById("btn-one-right").ontouchstart = function(){ setRtm("rightCanvas", 1); resetAllButton("btnRight"); document.getElementById("btn-one-right").style.background="#efefef"; };
document.getElementById("btn-two-right").ontouchstart = function(){ setRtm("rightCanvas", 2); resetAllButton("btnRight"); document.getElementById("btn-two-right").style.background="#efefef"; };
document.getElementById("btn-three-right").ontouchstart = function(){ setRtm("rightCanvas", 3); resetAllButton("btnRight"); document.getElementById("btn-three-right").style.background="#efefef"; };
document.getElementById("btn-four-right").ontouchstart = function(){ setRtm("rightCanvas", 4); resetAllButton("btnRight"); document.getElementById("btn-four-right").style.background="#efefef"; };
document.getElementById("btn-five-right").ontouchstart = function(){ setRtm("rightCanvas", 5); resetAllButton("btnRight"); document.getElementById("btn-five-right").style.background="#efefef"; };

function resetAllButton(name){
	var elements = document.getElementsByClassName(name);
	for(let i = 0; i < elements.length; i++){
		var cur = elements[i];

		cur.style.backgroundColor="";

	}
}
var metronomeMode=4;

var rightPlay=true;
document.getElementById("rightCanvas").ontouchstart = function(){ 
	rightPlay=!rightPlay;
	if (rightPlay){
		document.getElementById("rightAudio").style.backgroundImage="";
	} else {
		document.getElementById("rightAudio").style.backgroundImage="url(mute.png)";
	}
};

var leftPlay=true;
document.getElementById("leftCanvas").ontouchstart = function(){ 
	leftPlay=!leftPlay;
	if (leftPlay){
		document.getElementById("leftAudio").style.backgroundImage="";
	} else {
		document.getElementById("leftAudio").style.backgroundImage="url(mute.png)";
	}
};


document.getElementById("metronomeBtn").ontouchstart = function(){ 

	if (metronomeMode==4){
		metronomeMode=2;
		document.getElementById("metronomeBtn").innerHTML="Metronome (2)";
	} else if (metronomeMode==2){
		metronomeMode=1;
		document.getElementById("metronomeBtn").innerHTML="Metronome (1)";
	} else if (metronomeMode==1){
		metronomeMode=0;
		document.getElementById("metronomeBtn").innerHTML="Metronome (off)";
	} else if (metronomeMode==0){
		metronomeMode=4;
		document.getElementById("metronomeBtn").innerHTML="Metronome (4)";
	}
	
	console.log(metronomeMode);

};

var rightOldCombination="", leftOldCombination="";

var oldPressedTimeRight=Date.now();
var oldPressedTimeLeft=Date.now();

var totalTimeDifferenceArr=[0,0,0,0,0,0];

function showPoints(){
	var sum=(totalTimeDifferenceArr.map(function (v) { return +v; })
                .sort(function (a,b) { return a-b; })
                .slice( 0,4 )
                .reduce(function (a,b) { return a+b; }))/14;

	
	
	if (sum>109) sum=109;
	
	document.getElementById("pointer").style.top=parseInt(sum+3)+"px";
}

function setRtm(name, split){
	
	
	if (name=="leftCanvas" && leftOldCombination==split){
		
		if (leftPlay==false){
			samplerL.connect(leftPanner).triggerAttackRelease("A0", 0.5);
		}
		
		var currentLeftTime=Date.now()-oldPressedTimeLeft;
		
		totalTimeDifferenceArr.push(Math.abs(currentLeftTime-leftTime));
		totalTimeDifferenceArr.shift();
		//console.log("myLeftTime", currentLeftTime);
		showPoints()
		oldPressedTimeLeft=Date.now();
		
		return;
	}
	
	
	if (name=="rightCanvas" && rightOldCombination==split){
		
		if (rightPlay==false){
			samplerR.connect(leftPanner).triggerAttackRelease("A0", 0.5);
		}
		
		var currentRightTime=Date.now()-oldPressedTimeRight;
		
		totalTimeDifferenceArr.push(Math.abs(currentRightTime-rightTime));
		totalTimeDifferenceArr.shift();
		showPoints()
		console.log("myRightTime", totalTimeDifferenceArr);
		
		oldPressedTimeRight=Date.now()
		//console.log("doNothing");
		return;
	}
	

	splitCircle(name, split);
	if (name=="leftCanvas"){
		clearLeftAngles(split);
		leftOldCombination=split;
		totalTimeDifferenceArr=[0,0,0,0,0,0];
		//setLeftAngles();
	}
	if (name=="rightCanvas"){
		clearRightAngles(split);
		rightOldCombination=split;
		totalTimeDifferenceArr=[0,0,0,0,0,0];
		//setRightAngles();
	}
	

	
	
	
}



const bpmSlider = document.querySelector('#bpmSlider');
bpmSlider.addEventListener('input', (event) => {
  intervalAnim=parseInt(event.target.value);
  document.getElementById("bpmValue").innerHTML = intervalAnim;
  var animSeconds=60/intervalAnim * 4;
  console.log("seconds", animSeconds);
  document.getElementById("right-rtm").style.animationDuration=animSeconds+"s";
  document.getElementById("left-rtm").style.animationDuration=animSeconds+"s";
  
});


const sampler = new Tone.Sampler({
			urls: {
				A0: "metronome.wav",
			},
			release: 1,
			onload: activateSound,
			baseUrl: "sounds/"
});

const samplerR = new Tone.Sampler({
			urls: {
				A0: "right.wav",
			},
			release: 1,
			onload: activateSound,
			baseUrl: "sounds/"
});

const samplerL = new Tone.Sampler({
			urls: {
				A0: "left.wav",
			},
			release: 1,
			onload: activateSound,
			baseUrl: "sounds/"
});

soundRtmBool=false;
function activateSound(){
	soundRtmBool=true;
}
//osc.frequency.value = startValue;

const rightPanner = new Tone.Panner(0.7).toDestination();
const leftPanner = new Tone.Panner(-0.7).toDestination();
const metroPanner = new Tone.Panner(0).toDestination();
var rtmDiff=600;

//sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5);
var timeRtm=0;
var rotatingIncrement=0;

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

function getCurrentRotation(el){
  var st = window.getComputedStyle(el, null);
  var tm = st.getPropertyValue("-webkit-transform") ||
           st.getPropertyValue("-moz-transform") ||
           st.getPropertyValue("-ms-transform") ||
           st.getPropertyValue("-o-transform") ||
           st.getPropertyValue("transform") ||
           "none";
  if (tm != "none") {
    var values = tm.split('(')[1].split(')')[0].split(',');
    /*
    a = values[0];
    b = values[1];
    angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
    */
    //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
    var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
    return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
  }
  return 0;
}

var oldAngle=0;
var inf=99999;

var metronomeAngles=[];
var leftAngles=[];
var rightAngles=[];

function setMetronomeAngles(){
	for (let i = 0; i < metronomeAngles.length; i++) {
		metronomeAngles[i]=(360/metronomeAngles.length*i);
	}
}
function clearMetronomeAngles(num){
	metronomeAngles=[];
	for (let i = 0; i < num; i++) {
		metronomeAngles.push(inf);
	}
}


function setLeftAngles(){
	for (let i = 0; i < leftAngles.length; i++) {
		leftAngles[i]=(360/leftAngles.length*i);
	}
}
function clearLeftAngles(num){
	leftAngles=[];
	for (let i = 0; i < num; i++) {
		leftAngles.push(inf);
	}
}

function setRightAngles(){
	for (let i = 0; i < rightAngles.length; i++) {
		rightAngles[i]=(360/rightAngles.length*i);
	}
}
function clearRightAngles(num){
	rightAngles=[];
	for (let i = 0; i < num; i++) {
		rightAngles.push(inf);
	}
}

clearMetronomeAngles(4);

var leftTime=0;
var rightTime=0;

var oldTimeLeft=Date.now();
var oldTimeRight=Date.now();
function step(timestamp) {
	
	var currentAngle=getCurrentRotation(document.getElementById("left-rtm"));
	
	
	if (oldAngle>currentAngle){
		//console.log("start");
		setMetronomeAngles();
		setRightAngles();
		setLeftAngles();
		//console.log(metronomeAngles);
		
	}
	
	
	//metronome
	for (let i = 0; i < metronomeAngles.length; i++) {
		
		if (currentAngle>metronomeAngles[i]){
			metronomeAngles[i]=inf;
			
			if (metronomeMode==4){
				if (currentAngle>290 || currentAngle <45){
					sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5, "+0", 1);
				} else {
					sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5, "+0", 0.3);
				}
			} else if (metronomeMode==1){
				if (currentAngle>290 || currentAngle <45){
					sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5, "+0", 1);
				}
			} else if (metronomeMode==2){
				if (currentAngle>290 || currentAngle <45){
					sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5, "+0", 1);
				}
				
				if (currentAngle>120 && currentAngle <240){
					sampler.connect(metroPanner).triggerAttackRelease("A0", 0.5, "+0", 0.3);
				}
			}
			
			
			//console.log(currentAngle);
			
		}
	
	}
	


		for (let i = 0; i < leftAngles.length; i++) {
			
			if (currentAngle>leftAngles[i]){
				leftAngles[i]=inf;
				if (leftPlay){
				samplerL.connect(leftPanner).triggerAttackRelease("A0", 0.5);
				}
				//console.log(currentAngle);
				
				leftTime=Date.now() - oldTimeLeft;
				//console.log("leftTime",leftTime);
				
				oldTimeLeft=Date.now();
				

				
			}
			
			
		
		}
	
	
	
		for (let i = 0; i < rightAngles.length; i++) {
			
			if (currentAngle>rightAngles[i]){
				rightAngles[i]=inf;
				
				if (rightPlay){
				samplerR.connect(rightPanner).triggerAttackRelease("A0", 0.5);
				}
				//console.log(currentAngle);
				
				rightTime=Date.now() - oldTimeRight;
				//console.log("rightTime", rightTime);
				
				oldTimeRight=Date.now();
				
			}
		
		}
	

	
	oldAngle=currentAngle;

	window.requestAnimationFrame(step);
	
}


window.requestAnimationFrame(step);
