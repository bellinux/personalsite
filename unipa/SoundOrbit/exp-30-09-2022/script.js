var sound = new Pizzicato.Sound({ 
    source: 'file',
    options: { path: 'sound4s.wav' }
}, function() {
    //console.log('sound file loaded!');
});

var sound3d = new Pizzicato.Sound({ 
    source: 'file',
    options: { path: 'sound4s3d.wav' }
}, function() {
    //console.log('sound file loaded!');
});



function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

function pearsonCorrelation(prefs, p1, p2) {
  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  return num / den;
}


var mouseArrX=[];
var mouseArrY=[];
var saxArrX=[];
var saxArrY=[];
var clavinetArrX=[];
var clavinetArrY=[];
var vibArrX=[];
var vibArrY=[];
for (let i = 0; i < 180; i++) {
  mouseArrX.push(0);
  mouseArrY.push(0);
  saxArrX.push(0);
  saxArrY.push(0);
  clavinetArrX.push(0);
  clavinetArrY.push(0);
  vibArrX.push(0);
  vibArrY.push(0);
}

document.onmousemove = function(e){
	move(e.pageX, e.pageY);
}


document.addEventListener("touchmove", function(e) {
    e.preventDefault();
	move(e.touches[0].pageX, e.touches[0].pageY);
}, {passive: false});


let pointNum=0;
let textData="cond;age;gender;dotx;doty;fingerx;fingery\n";

let pointNumberToCollect=2000;
document.getElementById("totalPoint").innerHTML=pointNumberToCollect*2;


function move(scrX, scrY){
	
	if (countHide<2) return;
		
		
	pointNum++;
	document.getElementById("pointNumber").innerHTML=pointNum;

	mouseArrY.push(parseInt(scrY));
	mouseArrX.push(parseInt(scrX));

	saxX=parseInt(getOffset(document.getElementById("left-orbit-dot")).left+15);
	saxArrX.push(saxX);
	
	saxY=parseInt(getOffset(document.getElementById("left-orbit-dot")).top+15);
	saxArrY.push(saxY);
	
	if (experiment){
		
		
		textData+=ab+";"+age+";"+gender+";"+saxX+";"+saxY+";"+scrX+";"+scrY+"\n";
		
		
		
		if (pointNum==pointNumberToCollect){
			
			

			if (ab=="3d"){
				ab="mono";
				countHide=0;
			} else if (ab=="mono"){
				ab="3d";
				countHide=0;
			}
			
			pointNum++;
			alert("Stop. Please, continue...");
			
		}
		
		if (pointNum>(pointNumberToCollect*2)){
			
			pointNum++;
			experiment=false;
			ab="none";
			console.log(textData);
			
			var hiddenElement = document.createElement('a');

			hiddenElement.href = 'data:attachment/text,' + encodeURI(textData);
			hiddenElement.target = '_blank';
			hiddenElement.download = ab+age+gender+Date.now()+'.csv';
			hiddenElement.click();
  
  
			alert("Stop. Thank you.");
			location.reload();
		}
			
			
	}
	

	if (experiment) return;
	
	mouseArrY.shift();
	mouseArrX.shift();
	saxArrX.shift();
	saxArrY.shift();

	corrMXSX = pearsonCorrelation(new Array(mouseArrX, saxArrX), 0, 1);
	corrMYSY = pearsonCorrelation(new Array(mouseArrY, saxArrY),0,1);
	corrSax=Math.max(corrMYSY, corrMXSX);
	


	
	if (corrSax > 0.80){
		//console.log("Sax");
		document.getElementById("left-orbit").style.background = "#ffff00";
		for (let i = 0; i < 120; i++) {  mouseArrY.push(0);	mouseArrY.shift(); mouseArrX.push(0);	mouseArrX.shift()}
		setTimeout(function(){ document.getElementById("left-orbit").style.background = ""; }, 500);
	} //else {
		//document.getElementById("left-orbit").style.background = "";
	//}
	
	
	//console.log("Sax: ", corrSax, "Clavinet: ", corrClavinet);
	console.log("Fagotto: ", parseInt(corrSax*100));
	
};




document.getElementById("start").onclick = function(){
	
	document.getElementById("start").style.display = "none";
	document.getElementById("ab").style.display = "block";
	document.getElementById("ba").style.display = "block";
	document.getElementById("left-orbit").style.animationPlayState = "running";
	//sound.play();
	window.requestAnimationFrame(step);
};

document.getElementById("ab").onclick = function(){
	collectData("3d");
	countHide=0;

};


document.getElementById("ba").onclick = function(){
	collectData("mono");
	countHide=0;

};
let experiment=false;

let ab="mono";
let age;
let gender;

function collectData(type){
	ab=type;
	
	pointNum=0;
	experiment=true;
	document.getElementById("ab").style.display = "none";
	document.getElementById("ba").style.display = "none";
	var elems = document.querySelectorAll(".dot");
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.opacity = parseInt(0);
    }
	
	age = prompt('Age');
	gender = prompt('Gender');
	alert("No feedback is shown while following the sound. Just follow the sound as better as you can.");

	mouseArrY=[];
	mouseArrX=[];
	saxArrX=[];
	saxArrY=[];
	document.getElementById("pointNumber").innerHTML="0";
	document.getElementById("trial").style.display = "block";
}

var activateBool=false;
var countHide=0;

function step(timestamp) {
	const compStyles = window.getComputedStyle(document.getElementById("left-orbit"));
	tr=compStyles.getPropertyValue('transform');
	//console.log(transformValue);
	
	
	var values = tr.split('(')[1].split(')')[0].split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	//var scale = Math.sqrt(a*a + b*b);

	//console.log('Scale: ' + scale);

	// arc sin, convert from radians to degrees, round
	//var sin = b/scale;
	// next line works for 30deg but not 130deg (returns 50);
	// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

	//console.log('Rotate: ' + angle + 'deg');
	if (angle<-10){
		activateBool=true;
	} else if (angle>0 && activateBool==true){
		//console.log("play " + countHide);
		activateBool=false;
		sound.stop();
		sound3d.stop();
		
		if (countHide>0){
			if (ab=="mono"){
				
				sound.play();
			} else if (ab=="3d") {
				
				sound3d.play();
			}
		}
		countHide++;
		//if (countHide>3){
			//document.getElementById("left-orbit-dot").style.opacity = "0";
			
		//}
	}


  window.requestAnimationFrame(step);
  
}

var show = 1;
document.ondblclick = function(e){
	if (experiment) return; 
	show=Math.abs(show-1);
	
	var elems = document.querySelectorAll(".dot");
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.opacity = parseInt(show);
    }

	
	//console.log("dbl");
}
