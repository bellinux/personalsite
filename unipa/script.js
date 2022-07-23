let prevTime;
let timeDiff;
let seq = [0,0,0,0,0];
let marginLeft=0;
let marginTop=0;
prevTime=Date.now();
let movementStep=30;


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
		marginTop=marginTop+movementStep;
	} else if ((seq[1]=="R" && seq[2]=="L" && seq[3]=="R" && seq[4]=="L") || (seq[1]=="L" && seq[2]=="R" && seq[3]=="L" && seq[4]=="R")){
		console.log("Up");
		marginTop=marginTop-movementStep;
	} else if (checkSequence("R")){
		console.log("Right");
		marginLeft=marginLeft+movementStep;
	} else if (checkSequence("L")){
		console.log("Left");
		marginLeft=marginLeft-movementStep;
	}
	
	document.getElementById('pointer').style.marginLeft=marginLeft+"px";
	document.getElementById('pointer').style.marginTop=marginTop+"px";
}

document.addEventListener("keypress", detector);
