const audios = {
	settings: {
		minSequence: 2,
		autoStopAfterCycle: 3,
	},
	commands: [
		{ src: "commands/blu.mp3", key: "blue" },
		{ src: "commands/verde.mp3", key: "green" },
		{ src: "commands/rosso.mp3", key: "red" },
	]
}

var audioFiles=[];
var currentAudio=0;
var started=false;
var commandSequence=[];
const allEqual = arr => arr.every( v => v === arr[0] )

document.onkeypress = function(){
	if (started==false){
		init(audios);
		started=true;
	}
	
	var lastCommand
	
	for (let i = 0; i < audioFiles.length; i++) {
		if (audioFiles[i].currentTime < audioFiles[i].duration){
			
			commandSequence.push(audios.commands[i].key);
			commandSequence.shift();
		}
	}

	
	if (allEqual(commandSequence)){
		//console.log("command: ", commandSequence[0]);
		const event = new CustomEvent('command', { detail: commandSequence[0] });
		document.dispatchEvent(event);
		
	}
	
	
};

function init(settings){
	
	for (const audios of settings.commands) {
		console.log(audios);
		var currentAudio=document.createElement("AUDIO");
		currentAudio.src=audios.src;
		currentAudio.onended = next;
		audioFiles.push(currentAudio);
	}
	
	for (let i = 0; i < audios.settings.minSequence; i++) {
		commandSequence.push(i);
	}
	
	next();
}

function next(){
	audioFiles[currentAudio].play();
	currentAudio++;
	if (currentAudio >= audioFiles.length){
		currentAudio=0;
	}
	
	console.log("ended");
	
}