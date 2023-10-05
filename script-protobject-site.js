


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}




$( document ).ready(function() {


	
	if (inIframe()){
		$("#mainTopBar").css("display","none");
		$("#mainFooterMenu").css("display","none");
		$("#mainFooterFinal").css("display","none");
		$("#classtext").css("display","none");
		
		$("html, body").css("overflow-x","hidden");
	}

$(document).on( "click", "#class-plan", function() {
		var element = $("#classtext").find('.et_pb_toggle_content')[0];

		var newWin = open('url', '_blank');
		var html = `
		<html>
		<head>  
		<title>Plan de clase</title>
		<style>
		html{color: #000!important; font-family: sans-serif;}
		</style>
		</head>
		<body>${element.innerHTML}</body>
		<script>
		var elements = document.querySelectorAll("*");
		elements.forEach((note) => {
			note.style.color = '#000';
		});
		window.print();
		</script>
		</html>;
		`;
		newWin.document.write(html);
	});
	
	

	var styles = `

	.slideButtons {
	    border-radius: 35px;
	    width: 35px;
	    height: 35px;
	    display: inline-block;
	    text-align: center;
	    line-height: 25px;
	    font-size: 35px;
	    background-color: #ddd;
	    color: #000;
	}

	.slideStatus {
	    border-radius: 35px;
	    height: 35px;
	    display: inline-block;
	    text-align: center;
	    line-height: 35px;
	    font-size: 20px;
	    background-color: #ddd;
	    color: #000;
	    margin: 0 10px 0 6px;
	    padding: 0 20px;
	}

	`

	var styleSheet = document.createElement("style")
	styleSheet.innerText = styles
	document.head.appendChild(styleSheet)


	var div = document.createElement("div");
	div.class="slideNavigator";
	div.style=`

		position: absolute;
	    left: 20px;
	    top: calc(100% - 70px);
	    background: #fff;
	    border-radius: 34px;
	    padding: 10px;
		display:none;
		user-select: none;

	`;
	div.innerHTML = `<a href="#" class="previousCommand slideButtons">&#8249;</a> <span class="slideStatus"></span><a href="#" class="nextCommand slideButtons">&#8250;</a>`;


	var currentSlide=0;
	var nSlides=0;


	if($(".slide").length>0){
		currentSlide=0;
		nSlides=$(".slide").length;
		$(".slide")[0].appendChild(div);
		$(".slideStatus").html((currentSlide+1)+'/'+nSlides);
	}

	$( ".previousCommand" ).click(function() {
		if (currentSlide>0){
			currentSlide--;
			$(".slide")[currentSlide].appendChild(div);
			//document.exitFullscreen()
			//	.then((value) => {
					$(".slide")[currentSlide].requestFullscreen();
			//	});
			$(".slideStatus").html((currentSlide+1)+'/'+nSlides);

		}


	});

	$( ".nextCommand" ).click(function() {
		if (currentSlide<nSlides-1){
			currentSlide++;
			$(".slide")[currentSlide].appendChild(div);
			//document.exitFullscreen()
			//	.then((value) => {
					$(".slide")[currentSlide].requestFullscreen();
			//	});
			$(".slideStatus").html((currentSlide+1)+'/'+nSlides);
		}


	});



	function fullscreenchanged(event) {
	  if (document.fullscreenElement) {
	    $(div).css("display","block");
		$(".hideOnPresentation").css("display","none");
		$(".slide").css("display","flex");
		$(".slide").css("flex-wrap","wrap");
		$(".slide").css("align-content","center");
	  } else {
		$(div).css("display","none");
		$(".hideOnPresentation").css("display","");
		$(".slide").css("display","");
		$(".slide").css("flex-wrap","");
		$(".slide").css("align-content","");

	  }
	};


	document.onfullscreenchange = fullscreenchanged;




	$(document).on( "click", "#start-presentation", function() {

		$(".slide")[currentSlide].requestFullscreen();
		//$(".slide")[currentSlide].appendChild(div);
	});
	
	
	$("#activity-filter input[type='checkbox']").change(function() {
		$(".et_pb_post").hide();
		let showAll=true;
		$("#activity-filter input[type='checkbox']").each(function( index ) {
			if($( this )[0].checked){
				$(".tag-"+$( this )[0].id.split("_")[3]).show();
				showAll=false;
			}
		});
		if (showAll){
			$(".et_pb_post ").show();
		}
		$("#activity-number span").html($('.et_pb_post:not([style*="display: none"])').length);
		$('.et_pb_post:not([style*="display: none"])').length
	});

	if ($("#activity-number span")){
		$("#activity-number span").html($('.et_pb_post:not([style*="display: none"])').length);
	}

});
