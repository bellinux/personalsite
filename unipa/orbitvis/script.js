
var xoffset=-420;
var yoffset=-30;

var urlAjax="";
$("#controlHidden").css("display","none");

 
 $("#visualizer").css("display","none");
 var data;
 var dataSelection=[];
 $(document).ready(function(){
	 
	if (location.search){
		console.log("ajax open");
		urlAjax="https://docs.google.com/spreadsheets/d"+location.search.substring(1);
		console.log(urlAjax);
		
		Papa.parse(urlAjax, {
			download: true,
			complete: displayHTMLTable,
		});
	}
	 
	 
    $('#submit-file').on("click",function(e){
		e.preventDefault();
		$('#files').parse({
			config: {
				delimiter: ";",
				complete: displayHTMLTable,
			},
			before: function(file, inputElem)
			{
				//console.log("Parsing file...", file);
			},
			error: function(err, file)
			{
				//console.log("ERROR:", err, file);
			},
			complete: function()
			{
				//console.log("Done with all files");
			}
		});
    });
	
	function displayHTMLTable(results){
		var table = "<table class='table'>";
		data = results.data;
		console.log(data);

		$("#formInput").css("display","none");
		$("#visualizer").css("display","block");
		
		//showData();
	}
  });
  
var canvas = document.getElementById("myData");
var ctx = canvas.getContext("2d");
var from=0;
var windowSize=60;

const frmElement = document.querySelector('#frm');
frmElement.addEventListener('input', (event) => {
  from=parseInt(event.target.value);
  showData();
});

const wsizeElement = document.querySelector('#wsize');
wsizeElement.addEventListener('input', (event) => {
  windowSize=parseInt(event.target.value);
  showData();
});



const circularBtnElement = document.querySelector('#circularBtn');
circularBtnElement.addEventListener('click', (event) => {
	$("#circularBtn").prop( "disabled", true );
	$("#staticBtn").prop( "disabled", false );
	$("#controlHidden").css("display","block");
	dataSelection=[];
  	for (let i = 0; i < data.length; i++) {
		if (data[i][0]=="circular"){
			dataSelection.push(data[i]);
		}
	}
	showData();
});

const staticBtnElement = document.querySelector('#staticBtn');
staticBtnElement.addEventListener('click', (event) => {
	$("#circularBtn").prop( "disabled", false );
	$("#staticBtn").prop( "disabled", true );
	$("#controlHidden").css("display","block");
	dataSelection=[];
  	for (let i = 0; i < data.length; i++) {
		if (data[i][0]=="static"){
			dataSelection.push(data[i]);
		}
	}
	showData();
	
});

var intervalAnim=4;

const anmElement = document.querySelector('#anm');
anmElement.addEventListener('input', (event) => {
  intervalAnim=parseInt(event.target.value);
  console.log(intervalAnim);
});

var animTimeout;

const animBtnElement = document.querySelector('#animBtn');
animBtnElement.addEventListener('click', (event) => {
	
	playAnim()
});

function playAnim(){
	animTimeout=setTimeout(function () {
		frmElement.value=parseInt(frmElement.value)+1;
		from=parseInt(frmElement.value);
		showData();
		playAnim();
		
	}, intervalAnim);
	
}

const stopBtnElement = document.querySelector('#stopBtn');
stopBtnElement.addEventListener('click', (event) => {
	
	clearTimeout(animTimeout);
});
  
function showData(){
	ctx.clearRect(0, 0, 3000, 3000);
	
	for (let i = from+1; i < from+windowSize+1; i++) {
		console.log(i);
		ctx.fillStyle = "blue";
		console.log("x", parseInt(dataSelection[i][3])+xoffset);
		ctx.fillRect(parseInt(dataSelection[i][3])+xoffset,parseInt(dataSelection[i][4])+yoffset,4,4);
		ctx.fillStyle = "red";
		ctx.fillRect(parseInt(dataSelection[i][5])+xoffset,parseInt(dataSelection[i][6])+yoffset,4,4);
	}
	  

	  
}