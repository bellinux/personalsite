

$( document ).ready(function() {
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
});
