window.onload = initialize;
var socket = io();


function initialize(){
	var elem = document.getElementById("force");
	window.force = 0;
	window.throwing = false;
	window.down = false;
	document.onkeydown = pressed;
	document.onkeyup = released;
}

function createBoxes(){
	for(x=0; x<=20; x++){
		var table = document.getElementById('table');
	}
}

function pressed(){
	if(event.keyCode == "37"&&!throwing){
		if(parseFloat($("#ball1").css('left'))<="-180"){
			$('#ball1').stop(true);
		}
		else{
			left = 10;
			$("#ball1").animate({left: "-=" + left + 'px'}, 'fast');
			console.log($("#ball1").css('left'));
		}	
	}
	if(event.keyCode =="39"&&!throwing){
		if(parseFloat($("#ball1").css('left'))>="180"){
			$('#ball1').stop(true);
		}
		else{
			left = 10;
			$("#ball1").animate({left: "+=" + left + 'px'}, 'fast');
			console.log($("#ball1").css('left'));
		}
	}
	if(event.keyCode =="16"){
		throwing = true;
		console.log("Shift");//or if Space 32
		shoot();
	}
	
}

function shoot(){
	if(force==100&&down==false){
		down = true;
	}

	else if(force==0&&down==true){
		down = false;
	}
	else if(down==true){
		force--;
	}
	else if(down==false){
		force++;
	}
	else{
	}
	document.getElementById("force").style.width = force + '%';
	console.log("Force: " + force);
	window.distance = 600 * (force/100);
}

function released(event){
	if(event.keyCode == "16"){
		var final_force = force;
		var x = $("#ball1").css('left');
		var y = distance;
		force = 0;
		//alert("Aim: " + x + " Force: " + final_force + " Distance: " + distance);
		$("#ball1").animate({top: (-distance) + 'px'},1000);
		throwing = false;
		console.log('final_force: '+ final_force);
		var shotDetails = {
			final_force : final_force;
			x : x;
			y : y;
		};
		alert(shotDetails);
		socket.emit('shot details', shotDetails);
	}
	else{
		$('#ball1').stop(true);
	}
}