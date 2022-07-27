let currentDirection="";
let currentDirectionX="";
let currentDirectionY="";
let tempo = 120.0;
let tempo2 = 250.0;

var canvas = document.getElementById("paint-canvas");
var prevPoints=[0,0];
var prevPointsAngle=[0,0];
var calculateEach=1;
var cycle=0;

var calculateEachAngle=2;
var cycleAngle=0;
var speedArr= [0,0,0,0,0,0,0];
var speedArr2=[0,0,0,0,0,0,0];
var isDrawing = false;

var speedToBpm=40;
var tailDuration=2;
window.onload = function () {

  // Definitions

  var context = canvas.getContext("2d");
  var boundings = canvas.getBoundingClientRect();
  canvas.width=window.innerWidth-162;
  canvas.height=window.innerHeight-6;

  // Specifications
  var mouseX = 0;
  var mouseY = 0;
  context.strokeStyle = 'black'; // initial brush color
  context.lineWidth = 1; // initial brush width
  


  // Handle Colors
  var colors = document.getElementsByClassName('colors')[0];

  colors.addEventListener('click', function(event) {
    context.strokeStyle = event.target.value || 'black';
  });

  // Handle Brushes
  var brushes = document.getElementsByClassName('brushes')[0];

  brushes.addEventListener('click', function(event) {
    context.lineWidth = event.target.value || 1;
  });

  // Mouse Down Event
  canvas.addEventListener('mousedown', function(event) {
	  slowing=false;
	  
	  

	  
	if (isStopped){
            // Check if context is in suspended state (autoplay policy)
            if (audioCtx.state === "suspended") {
              audioCtx.resume();
            }

            currentNote = 0;
            nextNoteTime = audioCtx.currentTime;
			nextNoteTime2 = audioCtx.currentTime;
            scheduler(); // kick off scheduling
			scheduler2(); // kick off scheduling
			isStopped=false;
	}  
	  
	  
	  
	  
    setMouseCoordinates(event);
	prevPoints[0]=mouseX;
	prevPoints[1]=mouseY;
	
	prevPointsAngle[0]=mouseX;
	prevPointsAngle[1]=mouseY;
    isDrawing = true;

    // Start Drawing
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });

  // Mouse Move Event
  canvas.addEventListener('mousemove', function(event) {
	  slowing=false;
    setMouseCoordinates(event);

    if(isDrawing){
      context.lineTo(mouseX, mouseY);
	  
	  cycle++;
	  if (cycle>2){
	  
		var xd = Math.abs(mouseX - prevPoints[0])*speedToBpm;
		var yd = Math.abs(mouseY - prevPoints[1])*speedToBpm;

		//var distance = Math.sqrt( a*a + b*b );
		cycle=0;
		//var speed=parseInt(Math.abs(distance*20));
		
		speedArr.push(xd);
		speedArr.shift();
		
		speedArr2.push(yd);
		speedArr2.shift();
		const averageX = speedArr.reduce((a, b) => a + b, 0) / speedArr.length;
		const averageY = speedArr2.reduce((a, b) => a + b, 0) / speedArr2.length;
		//console.log("BPM-X:", parseInt(averageX)+20, "BPM-Y:", parseInt(averageY)+20, "CDX", currentDirectionX, "CDY", currentDirectionY);
		
		
		tempo=parseInt(averageX)+40;
		tempo2=parseInt(averageY)+40;
		
		//var angleDeg = Math.atan2(prevPoints[1] - mouseY, prevPoints[0] - mouseX) * 180 / Math.PI;
		//console.log("Angle:", parseInt(angleDeg));
		
		
		
		prevPoints[0]=mouseX;
	    prevPoints[1]=mouseY;
		
	  //}
	    cycleAngle++;
	  //if (cycleAngle>calculateEachAngle){
	  

		var angleDeg = Math.atan2(prevPointsAngle[1] - mouseY, prevPointsAngle[0] - mouseX) * 180 / Math.PI;
		angleDeg=parseInt(angleDeg);
		//console.log("Angle:", parseInt(angleDeg));
		
		
		
		if (angleDeg>-90 && angleDeg<90 ) {
			currentDirectionX="R";
			if (angleDeg>0 && angleDeg<180) {
				currentDirectionY="U";
			} else {
				currentDirectionY="D";
			}
			
		} else {
			currentDirectionX="L";
			if (angleDeg>0 && angleDeg<180) {
				currentDirectionY="U";
			} else {
				currentDirectionY="D";
			}
			
		}
			
		console.log("BPM-X:", parseInt(averageX)+20, "BPM-Y:", parseInt(averageY)+20, "CDX", currentDirectionX, "CDY", currentDirectionY);
		//console.log("CDX", currentDirectionX, "CDY", currentDirectionY);
		

		
		
		
		prevPointsAngle[0]=mouseX;
	    prevPointsAngle[1]=mouseY;
		cycleAngle=0;
	  }
	  
	  
	 
	  
	  
      context.stroke();
	  
	  
    }
  });

  // Mouse Up Event
  canvas.addEventListener('mouseup', function(event) {
	  slowing=true;
    setMouseCoordinates(event);
    isDrawing = false;
  });

  // Handle Mouse Coordinates
  function setMouseCoordinates(event) {
    mouseX = event.clientX - boundings.left;
    mouseY = event.clientY - boundings.top;
  }

  // Handle Clear Button
  var clearButton = document.getElementById('clear');

  clearButton.addEventListener('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Handle Save Button
  var saveButton = document.getElementById('save');

  saveButton.addEventListener('click', function() {
    var imageName = prompt('Please enter image name');
    var canvasDataURL = canvas.toDataURL();
    var a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
  });
};


window.onresize = function () {

  canvas.width=window.innerWidth-162;
  canvas.height=window.innerHeight-6;

};










      const audioCtx = new AudioContext();


      // Loading the file: fetch the audio file and decode the data
      async function getFile(audioContext, filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
      }

      let playbackRate = 1;
      
      // Create a buffer, plop in data, connect and play -> modify graph here if required
      function playSample(audioContext, audioBuffer, time, volume) {
		
		var gainNode = audioContext.createGain()
		gainNode.gain.value = volume;
		gainNode.connect(audioContext.destination);
		
        const sampleSource = new AudioBufferSourceNode(audioCtx, {
          buffer: audioBuffer,
          playbackRate: playbackRate,
        });
        sampleSource.connect(gainNode);
        sampleSource.start(time);
        return sampleSource;
      }

      async function setupWav(name) {
        const filePath = "wav/"+name+".wav";
        // Here we're waiting for the load of the file
        // To be able to use this keyword we need to be within an `async` function
        const sample = await getFile(audioCtx, filePath);
        return sample;
      }
	  


      
 

      const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
      const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

      let currentNote = 0; // The note we are currently playing
	  let currentNote2 = 0; // The note we are currently playing
      let nextNoteTime = 0.0; // when the next note is due.
	  let nextNoteTime2 = 0.0; // when the next note is due.
      function nextNote() {
        const secondsPerBeat = 60.0 / tempo;

        nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero when reaching 4
        currentNote = (currentNote+1) % 3;
      }
	  
	  function nextNote2() {
        const secondsPerBeat = 60.0 / tempo2;

        nextNoteTime2 += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero when reaching 4
        currentNote2 = (currentNote2+1) % 3;
      }

      // Create a queue for the notes that are to be played, with the current time that we want them to play:
      const notesInQueue = [];
	  const notesInQueue2 = [];
      let Lwav;
	  let Rwav;
	  let Uwav;
	  let UUwav;
	  let Xwav;

	  let volume = 1;
	
      function scheduleNote(beatNumber, time) {
        // Push the note into the queue, even if we're not playing.
        notesInQueue.push({ note: beatNumber, time: time });
		//console.log(beatNumber);
		if (!isDrawing)
			return;
		if (currentDirectionX=="R"){
			if (beatNumber==0){
				playSample(audioCtx, Lwav, time, volume);
			}
			if (beatNumber==1){
				playSample(audioCtx, Rwav, time, volume);
			}
			if (beatNumber==2){
				playSample(audioCtx, Rwav, time, volume);
			}
			
		}
		
		if (currentDirectionX=="L"){
			if (beatNumber==0){
				playSample(audioCtx, Rwav, time, volume);
			}
			if (beatNumber==1){
				playSample(audioCtx, Lwav, time, volume);
			}
			if (beatNumber==2){
				playSample(audioCtx, Lwav, time, volume);
			}
			
		}
		


        

      }
	  
	  
	   function scheduleNote2(beatNumber, time) {
		   if (!isDrawing)
			return;
        // Push the note into the queue, even if we're not playing.
        notesInQueue2.push({ note: beatNumber, time: time });
		//console.log(beatNumber);
		

		
		if (currentDirectionY=="D"){
			if (beatNumber==0){
				playSample(audioCtx, UUwav, time, volume);
			}
			if (beatNumber==1){
				playSample(audioCtx, Uwav, time, volume);
			}
			if (beatNumber==2){
				playSample(audioCtx, Xwav, time, volume);
			}
			
		}
		
		if (currentDirectionY=="U"){
			if (beatNumber==0){
				playSample(audioCtx, Xwav, time, volume);
			}
			if (beatNumber==1){
				playSample(audioCtx, Uwav, time, volume);
			}
			if (beatNumber==2){
				playSample(audioCtx, UUwav, time, volume);
			}
			
		}

        

      }

      let timerID;
      function scheduler() {
        // While there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
          scheduleNote(currentNote, nextNoteTime);
          nextNote();
        }
        timerID = setTimeout(scheduler, lookahead);
      }
	  
	  let timerID2;
      function scheduler2() {
        // While there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (nextNoteTime2 < audioCtx.currentTime + scheduleAheadTime) {
          scheduleNote2(currentNote2, nextNoteTime2);
          nextNote2();
        }
        timerID2 = setTimeout(scheduler2, lookahead);
      }


      let lastNoteDrawn = 3;



      
	  let isStopped = true;
     
	 setupWav("l").then((sample) => {
        Lwav = sample; // to be used in our playSample function
      });
	  
	  
	  setupWav("r").then((sample) => {
        Rwav = sample; // to be used in our playSample function
		
      });
	  
	 setupWav("u").then((sample) => {
        Uwav = sample; // to be used in our playSample function
      });
	  
	 setupWav("uuu").then((sample) => {
        UUwav = sample; // to be used in our playSample function
      });
	  
	 setupWav("xx").then((sample) => {
        Xwav = sample; // to be used in our playSample function
      });
	  

/*
window.requestAnimationFrame(step);

function step(time) {
	//console.log(isDrawing);
	if (!isDrawing){
		//console.log(time);
		
		
		
		
		
		

		if (tempo-tailDuration < 60){
			tempo=60;
		} else {
			tempo=tempo-tailDuration;
		}
		if (tempo2-tailDuration < 60){
			tempo2=60;
		} else {
			tempo2=tempo2-tailDuration;
		}
		
		
		
	}
	window.requestAnimationFrame(step);
	
}
*/


var SpeedToBPMSlider = document.getElementById("SpeedToBPM");

SpeedToBPMSlider.oninput = function() {
  speedToBpm = this.value;
  console.log(speedToBpm);
}
/*
var TailDurationSlider = document.getElementById("TailDuration");

TailDurationSlider.oninput = function() {
  tailDuration = this.value;
  console.log(tailDuration);
}
*/
