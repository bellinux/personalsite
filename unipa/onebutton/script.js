let pointSequence=usa2013.split("\n").slice(1);

const dot = document.getElementById('dot');
const target = document.getElementById('target');
const compStyles = window.getComputedStyle(dot);
let xMov=0;
let yMov=1;
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

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

var volumeIndex=0;

var rotationRtm=0;

function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

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
		
		
		sampler.connect(pianoPanner).triggerAttackRelease([rtmTone], 0.1, "+0", toneVolume[volumeIndex]/127);
		
		if (volumeIndex==1){
			volumeIndex=0;
		} else {
			volumeIndex=1;
		};
		
		//console.log(rtmDiff);
		timeRtm=timestamp;
	}
	
	
	
	
	
	dot.style.left = pLeft + "px";
	dot.style.top = pTop + "px";
	if (rotating){
		
		//rotatingIncrement+=0.001;
		
		//if (rotatingIncrement > 0.085){
		rotatingIncrement=(0.100/127)*afterTouch;
		

		
		if (timestamp-rotationRtm > convertRange(Math.abs(afterTouch-127), [0, 127], [80, 260])){
			//console.log('ok', rotationRtm, timestamp);
			rotationRtm=timestamp;
			playPulse();
		}
		
		
		
		
		
		//}
		
		//console.log(rotatingIncrement);
		
		//if (contrary){
		increment+=rotatingIncrement;
		//} else {
		//	increment-=rotatingIncrement;
		//}
		
		if (diff < 2){
			diff+=15;
		}
		
		
		//console.log(diff);
		
		//console.log(increment);
		//xMov=Math.sin(increment);
		//yMov=Math.cos(increment);
		
		yMov=Math.cos(increment);
		xMov=Math.sin(increment);
		
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
	downFunction(127);


}

function downFunction(volume){
	
	toneVolume.push(volume);
	toneVolume.shift();
	
	timeout=setTimeout(() => {

		rotating=true;
		oldDiff=diff;
		oldSpeedFactor=speedFactor;
		osc.start();

	}, pressedThreshold)
	
}

var rtmDiffArr=[0,0];
var diffArr=[0,0];

var preRtmDiff=0;
var preDiff=0;
var recording=false;

function triggerUp(e){
	
	//console.log(e);
	if (e.key=="r" && recording==false)	{
		iterateLines();
		recording=true;
		target.style.display="block";
	}

	upFunction(127);


	
}

var toneVolume=[127,127];

function upFunction(){
	
	dateFirstUp=Date.now();
	clearTimeout(timeout);

		
	preRtmDiff=rtmDiff;
	preDiff=diff;
		
	if (rotating==false){
		intervals.push(Date.now());
		intervals.shift();
		
		//toneVolume.push(volume);
		//toneVolume.shift();
		
		if (intervals[0] != 0){
			//console.log(intervals);
				
			rtmDiff = (intervals[1]-intervals[0]);
			rtmDiff=rtmDiff;
			diff = rtmDiff/300;
				

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

let pointIndex=0;
let coordinates="timestamp;ghostX;ghostY;targetX;targetY\n";
function iterateLines(){
	setTimeout(function(){ 
	
		let pointLine=pointSequence[pointIndex].split(",");
		if (pointIndex==1){
			target.classList.add("transition");
			dot.style.left = pointLine[3]/1.4 + "px";
			dot.style.top = pointLine[4]/1.4 + "px";
		}
		
		pointIndex++;
		//console.log(pointIndex, pointLine);
		
		target.style.left = pointLine[3]/1.4 + "px";
		target.style.top = pointLine[4]/1.4 + "px";
		
		
		
		if (pointIndex<pointSequence.length){
			iterateLines();
			coordinates+=Date.now()+";"+parseInt(getOffset(target).left)+";"+parseInt(getOffset(target).top)+";"+parseInt(getOffset(dot).left)+";"+parseInt(getOffset(dot).top)+"\n";
		} else {
			download_csv();
			alert("End");
			location.reload();
			//console.log(coordinates);
		}
		
	}, 283);
}
//iterateLines();


function download_csv() {
  var textToSave = coordinates;
  var hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = Date.now()+'.csv';
  hiddenElement.click();
}



document.addEventListener("keydown", triggerDown);

document.addEventListener("keyup", triggerUp);









navigator.requestMIDIAccess().then((access) => {
	onMIDISuccess(access);
});

inputList=document.getElementById('input');
logEventsMidi=document.getElementById('eventsMidi');
document.getElementById('lastMidiEv').style.display="none";
inputDevices=[];
function onMIDISuccess(midiAccess) {
	var i=0;
    for (var input of midiAccess.inputs.values()) {
        
		console.log(input);
		inputDevices.push(input);
		inputList.innerHTML=inputList.innerHTML+'<option value="'+i+'">'+input.name+'</option>'
		i++;
    }
}
var currentTime=Date.now();
inputList.addEventListener('input', function (event) {
	inputDevices[inputList.value].onmidimessage = getMIDIMessage;
	document.getElementById('lastMidiEv').style.display="block";
	document.getElementById('midiSelection').style.display="none";
	
});

document.getElementById('close').addEventListener('click', function (event) {
	document.getElementById('lastMidiEv').style.display="none";
	document.getElementById('midiSelection').style.display="none";
	
});

var afterTouch=100;
function getMIDIMessage(midiMessage) {
	
	logEventsMidi.innerHTML=logEventsMidi.innerHTML+midiMessage.data.toString()+'<br>';
	//console.log(midiMessage.data);
	
	if (midiMessage.data[0]==208){
		//console.log("aftertouch", midiMessage.data[1], Date.now()-currentTime)
		afterTouch=midiMessage.data[1];
	}
	
    if (midiMessage.data[1]==39){
	    
	    
		
		if (midiMessage.data[0]==144 && midiMessage.data[2]>0){
			downFunction(midiMessage.data[2]);
		}
		
		if (midiMessage.data[0]==144 && midiMessage.data[2]==0){
			upFunction();
		}
	    
	   	if (midiMessage.data[0]==128){
			upFunction();
		}
		
	}
}


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioCtx.destination.channelCount = audioCtx.destination.maxChannelCount;
var channels = audioCtx.destination.channelCount;
console.log(channels)
var frameCount = audioCtx.sampleRate * 0.5;
var myArrayBuffer = audioCtx.createBuffer(audioCtx.destination.channelCount, frameCount, audioCtx.sampleRate);

const pulse = 'pulse.mp3';

window.fetch(pulse)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => new AudioContext().decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
		myArrayBuffer.copyToChannel(audioBuffer.getChannelData(0), 2)
		myArrayBuffer.copyToChannel(audioBuffer.getChannelData(1), 3)
});
    
function playPulse(){
	var source = audioCtx.createBufferSource();
	source.buffer = myArrayBuffer;
	source.connect(audioCtx.destination);
	source.start();
}