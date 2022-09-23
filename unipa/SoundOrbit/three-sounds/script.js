var sound = new Pizzicato.Sound({ 
    source: 'file',
    options: { path: 'sound4s.wav' }
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
for (let i = 0; i < 220; i++) {
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
	move(e.screenX, e.screenY);
}

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
	move(e.touches[0].screenX, e.touches[0].screenY);
}, {passive: false});




function move(scrX, scrY){
	mouseArrX.push(scrX);
	mouseArrX.shift();
	mouseArrY.push(scrY);
	mouseArrY.shift();
	
	
	saxX=getOffset(document.getElementById("left-orbit-dot")).left;
	saxArrX.push(saxX);
	saxArrX.shift();
	
	saxY=getOffset(document.getElementById("left-orbit-dot")).top;
	saxArrY.push(saxY);
	saxArrY.shift();
	
	clavinetX=getOffset(document.getElementById("right-orbit-dot")).left;
	clavinetArrX.push(clavinetX);
	clavinetArrX.shift();
	
	clavinetY=getOffset(document.getElementById("right-orbit-dot")).top;
	clavinetArrY.push(clavinetY);
	clavinetArrY.shift();
	



	vibX=getOffset(document.getElementById("bottom-orbit-dot")).left;
	vibArrX.push(vibX);
	vibArrX.shift();
	
	vibY=getOffset(document.getElementById("bottom-orbit-dot")).top;
	vibArrY.push(vibY);
	vibArrY.shift();
	
	//console.log(e.screenX, clavinetX);
	
	
	corrMXSX = pearsonCorrelation(new Array(mouseArrX, saxArrX), 0, 1);
	corrMYSY = pearsonCorrelation(new Array(mouseArrY, saxArrY),0,1);
	corrSax=Math.max(corrMYSY, corrMXSX);
	

	
	corrMXCX = pearsonCorrelation(new Array(mouseArrX, clavinetArrX), 0, 1);
	corrMYCY = pearsonCorrelation(new Array(mouseArrY, clavinetArrY),0,1);
	//console.log(corrMXCX+corrMYCY)
	
	corrClavinet = Math.max(corrMYCY, corrMXCX);
	
	
	corrMXVX = pearsonCorrelation(new Array(mouseArrX, vibArrX), 0, 1);
	corrMYVY = pearsonCorrelation(new Array(mouseArrY, vibArrY),0,1);
	//console.log(corrMXCX+corrMYCY)
	
	corrVib = Math.max(corrMXVX, corrMYVY);
	
	if (corrSax > 0.96){
		//console.log("Sax");
		console.log("Act", parseInt(corrSax*100));
		document.getElementById("left-orbit").style.background = "#ffff00";
		for (let i = 0; i < 120; i++) {  mouseArrX.push(0); mouseArrX.shift(); mouseArrY.push(0);	mouseArrY.shift();}
		setTimeout(function(){ document.getElementById("left-orbit").style.background = ""; }, 500);
	} //else {
		//document.getElementById("left-orbit").style.background = "";
	//}
	
	if (corrClavinet > 0.96){
		console.log("Act", parseInt(corrClavinet*100));
		//console.log("Clavinet");
		document.getElementById("right-orbit").style.background = "#ffff00";
		for (let i = 0; i < 120; i++) {  mouseArrX.push(0); mouseArrX.shift(); mouseArrY.push(0); mouseArrY.shift();	}
		setTimeout(function(){ document.getElementById("right-orbit").style.background = ""; }, 500);
	} //else {
		//document.getElementById("right-orbit").style.background = "";
	//}
	
	if (corrVib > 0.96){
		console.log("Act", parseInt(corrVib*100));
		document.getElementById("bottom-orbit").style.background = "#ffff00";
		for (let i = 0; i < 120; i++) {  mouseArrX.push(0); mouseArrX.shift(); mouseArrY.push(0); mouseArrY.shift();	}
		setTimeout(function(){ document.getElementById("bottom-orbit").style.background = ""; }, 500);
	}
	
	console.log("Fagotto: ", parseInt(corrSax*100), "Xilofono: ", parseInt(corrVib*100), "Viola: ", parseInt(corrClavinet*100));
	
};




document.getElementById("start").onclick = function(){
	
	document.getElementById("start").style.display = "none";
	document.getElementById("left-orbit").style.animationPlayState = "running";
	document.getElementById("right-orbit").style.animationPlayState = "running";
	document.getElementById("bottom-orbit").style.animationPlayState = "running";
	//sound.play();
	window.requestAnimationFrame(step);
};

var activateBool=false;
var countHide=0;

function step(timestamp) {
	const compStyles = window.getComputedStyle(document.getElementById("right-orbit"));
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
	if (angle>10){
		activateBool=true;
	} else if (angle<0 && activateBool==true){
		//console.log("play " + countHide);
		activateBool=false;
		sound.stop();
		sound.play();
		countHide++;

	}


  window.requestAnimationFrame(step);
  
}


var show = 1;
document.ondblclick = function(e){
	show=Math.abs(show-1);
	
	var elems = document.querySelectorAll(".dot");
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.opacity = parseInt(show);
    }

	
	//console.log("dbl");
}
