let prevTime;
let timeDiff;
let seq = [0,0,0,0,0];
let marginLeft=0;
let marginTop=0;
prevTime=Date.now();
let movementStep=30;
let currentDirection="";

Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    }
});

function checkSequence(character){
	doubleSeq=false;
	for (let i = 0; i < seq.length; i++) {
		if ((seq[i] == character) && (seq[i+1] == character)){
			doubleSeq=true;
		}
	}
	return doubleSeq;
}

function detector(e){
	

	


	if (isStopped){
            // Check if context is in suspended state (autoplay policy)
            if (audioCtx.state === "suspended") {
              audioCtx.resume();
            }

            currentNote = 0;
            nextNoteTime = audioCtx.currentTime;
            scheduler(); // kick off scheduling
			isStopped=false;
	}  

    
		  
	timeDiff=Date.now()-prevTime;
	console.log(e.code, timeDiff);
	prevTime=Date.now();
	
	if (timeDiff<40) {
		
		seq.push("B");
		seq.shift();
		
	} else {
		if (e.code=="KeyL"){
			seq.push("R");
			seq.shift();
		} else if (e.code=="KeyA"){
			seq.push("L");
			seq.shift();
		}
	}
	
	
	console.log(seq);
	
	if (seq.count("B")>2){
		console.log("Bottom");
		currentDirection="B";
		marginTop=marginTop+movementStep;
		
		_taps.push( Date.now() );
		calcBPM();
	
	} else if ((seq[1]=="R" && seq[2]=="L" && seq[3]=="R" && seq[4]=="L") || (seq[1]=="L" && seq[2]=="R" && seq[3]=="L" && seq[4]=="R")){
		console.log("Up");
		currentDirection="U";
		marginTop=marginTop-movementStep;
		
		_taps.push( Date.now() );
		calcBPM();
		
	} else if (checkSequence("R")){
		currentDirection="R";
		console.log("Right");
		marginLeft=marginLeft+movementStep;
		
		_taps.push( Date.now() );
		calcBPM();
		
		
	} else if (checkSequence("L")){
		currentDirection="L";
		console.log("Left");
		marginLeft=marginLeft-movementStep;
		_taps.push( Date.now() );
		calcBPM();
	}
	
	document.getElementById('pointer').style.marginLeft=marginLeft+"px";
	document.getElementById('pointer').style.marginTop=marginTop+"px";
}






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
	  


      let tempo = 120.0;
 

      const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
      const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

      let currentNote = 0; // The note we are currently playing
      let nextNoteTime = 0.0; // when the next note is due.
      function nextNote() {
        const secondsPerBeat = 60.0 / tempo;

        nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero when reaching 4
        currentNote = (currentNote+1) % 3;
      }

      // Create a queue for the notes that are to be played, with the current time that we want them to play:
      const notesInQueue = [];
      let Lwav;
	  let Rwav;
	  let Uwav;
	  let UUwav;
	  let Xwav;

	  let volume = 1;
	
      function scheduleNote(beatNumber, time) {
        // Push the note into the queue, even if we're not playing.
        notesInQueue.push({ note: beatNumber, time: time });
		console.log(beatNumber);
		
		if (currentDirection=="R"){
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
		
		if (currentDirection=="L"){
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
		
		if (currentDirection=="B"){
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
		
		if (currentDirection=="U"){
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


      let lastNoteDrawn = 3;



      
	  let isStopped = true;
     
	 setupWav("l").then((sample) => {
        Lwav = sample; // to be used in our playSample function
      });
	  
	  
	  setupWav("r").then((sample) => {
        Rwav = sample; // to be used in our playSample function
		playButtonSetup();
      });
	  
	 setupWav("u").then((sample) => {
        Uwav = sample; // to be used in our playSample function
      });
	  
	 setupWav("uu").then((sample) => {
        UUwav = sample; // to be used in our playSample function
      });
	  
	 setupWav("x").then((sample) => {
        Xwav = sample; // to be used in our playSample function
      });
	  
	  function playButtonSetup(){

		document.addEventListener("keypress", detector);
	  }











const _bpm_elem = document.getElementById('BPM');
const _precision = 5;
let _bpm = 0;
let _taps = [];





function calcBPM() {
  let current_bpm = 0;
  let ticks = [];

  if (_taps.length >= 2) {
    
    for (let i = 0; i < _taps.length; i++) {
      if (i >= 1) {

        // calc bpm between last two taps
        ticks.push( Math.round( 60 / (_taps[i] / 1000 - _taps[i-1] / 1000) * 100) / 100 );
      }
    }
  }
  
  if (_taps.length >= 24) {
    _taps.shift();
  }
  
  if (ticks.length >= 2) {
    
    current_bpm = getAverage(ticks, _precision);
    
    // if (_taps.length >= _precision + 3) {     
    //   if (current_bpm % 2 == 1) current_bpm = getAverage(ticks, _precision + 1);
    //   if (current_bpm % 2 == 1) current_bpm = getAverage(ticks, _precision + 2);
    //   if (current_bpm % 2 == 1) current_bpm = getAverage(ticks, _precision + 3);
    // }
    
    // if (_bpm == 0 || _bpm - current_bpm >= 10) {
    //   _bpm = current_bpm;
    // }
    
    _bpm = current_bpm;

    showCurrentBPM();
  }
}


function getAverage(Values, Precision) {
  let ticks = Values;
  let n = 0;
  
  for (let i = ticks.length-1; i >= 0; i--) {
    n += ticks[i];
    if (ticks.length - i >= Precision) break;
  }

  return n / _precision;
}


function showCurrentBPM() {
  console.log(Math.round(_bpm));
  tempo=Math.round(_bpm)/1;
}

