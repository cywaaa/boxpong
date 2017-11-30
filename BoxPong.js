window.onload = initialize;
$(document).ready(function(){
	gameChanges();
});
var socket = io();


function initialize(){
	var elem = document.getElementById("force");
	window.force = 0;
	window.throwing = false;
	window.down = false;
	window.turn = false;
	document.onkeydown = pressed;
	document.onkeyup = released;
}

// ON READY GAME CHANGES
function gameChanges(){
	socket.on('mirror left', function(){
		//alert("Other player moved");
		moveRight("#ball2");
		console.log("Move Right");
		// $("#ball2").stop(true);
	});

	socket.on('mirror right', function(){
		//alert("Other player moved");
		moveLeft("#ball2");
		console.log("Move Right");
		// $("#ball2").stop(true);
	});
	$("#ball2").stop(true);
}

//END OF ON READY GAME CHANGES

function addPlayer(){
	socket.emit('add player');
	socket.on('receive',function(msg){
		if(msg=="false"){
			alert("A game is currently taking place (Maximum of 2 players only)");
		}
		else if(msg=="1" && turn==false){
			alert("Player 1 Accepted! You are player 1");
			$("#play").hide();
			//Show Game Area
			turn = true;	//Player's 1 get's the turn
			console.log("Player 1's turn: " + turn);
		}
		else if(msg == "2" && turn==false){
			alert("Player Accepted! You are player 2");
			$("#play").hide();
			//Show Game Area
			turn = false
			console.log("Player 2's turn: " + turn);
		}
		else{

		}
	});
}

function pressed(){
	if(turn!=false){
		if(event.keyCode == "37"&&!throwing){
			moveLeft("#ball1");
			// socket.emit('move left');
		}
		if(event.keyCode =="39"&&!throwing){
			moveRight("#ball1");
			
		}
		if(event.keyCode =="16"){
			throwing = true;
			console.log("Shift");//or if Space 32
			shoot();
		}
	}
}

function moveLeft(ball){
	if(parseFloat($(ball).css('left'))<="-180"){
		$(ball).stop(true);
	}
	else{
		var left = 10;
		$(ball).animate({left: "-=" + left + 'px'}, 'fast');
		console.log(ball +" : " + $(ball).css('left'));
		if(ball=="#ball1"){
			console.log("Move Left");
			socket.emit('move left');
		}
	}	
}

function moveRight(ball){
	if(parseFloat($(ball).css('left'))>="180"){
		$(ball).stop(true);
	}
	else{
		var left = 10;
		$(ball).animate({left: "+=" + left + 'px'}, 'fast');
		console.log(ball +" : " + $(ball).css('left'));
		if(ball=="#ball1"){
			console.log("Move Right");
			socket.emit('move right');
		}
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
	if(turn!=false){
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
				final_force : final_force,
				x : x,
				y : y
			};
			socket.emit('shot details', shotDetails);
		}
		else{
			
			$('#ball1').stop(true);
			// socket.off('move right');
			// socket.off('move left');
			
		}
	}
}
// socket.on('playStart', shotDetails);