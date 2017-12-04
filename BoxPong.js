window.onload = initialize;
$(document).ready(function(){
	gameChanges();
});
var socket = io();


function initialize(){
	var elem = document.getElementById("force");
	window.force = 0;
	window.oldPositionLeft = 0;
	window.oldPositionRight = 0;
	window.throwing = false;
	window.down = false;
	window.turn = false;
	window.playing = false;
	document.onkeydown = pressed;
	document.onkeyup = released;
}

// ON READY GAME CHANGES
function gameChanges(){
	socket.on('mirror left', function(x){
		// moveRight("#ball2");
		x=-x;
		mirrorLeft(x);
		// $('#ball2').stop(true);
	});

	socket.on('mirror right', function(x){
		// moveLeft("#ball2");
		x=-x;
		mirrorRight(x);
		// $('#ball2').stop(true);
		
	});

	socket.on('stop',function(){
		$("#ball2").stop(true);
	});

	socket.on('gameStart', function(){
		playing = true;
	});
	socket.on('playerDisconnect', function(){
		if(playing!=false){
			playing = false;
			alert("Opponent had disconnected. Game will be terminated");
			location.reload();
		}
		
	});
}

function mirrorRight(x){
	//$("#ball2").css('left') = 0;
	//var coordinate = parseFloat($("#ball2").css('left')) - x;
	alert($("#ball2").offset().left)
	console.log("Increment sent: " + x + "Current Position: " + $("#ball2").css('left') + "New position should be: " + (parseFloat($("#ball2").css('left')) + x));
	$("#ball2").animate({left: $("#ball2").position().left - x }, 'fast');
	// $("#ball2").animate({left: "-=" + x }, 'fast');
	// alert(x);
	console.log("Ball 2: " + parseFloat($("#ball2").css('left')));
	
	
}

function mirrorLeft(x){
	// $("#ball2").css('left') = 0;
	// var coordinate = parseFloat($("#ball2").css('left')) - x;
	console.log("Increment sent: " + x + "Current Position: " + $("#ball2").css('left') + "New position should be: " + (parseFloat($("#ball2").css('left')) + x));
	// $("#ball2").animate({left: "+=" + x }, 'fast');
	$("#ball2").animate({left: $("#ball2").position().left + x }, 'fast');
		// alert(x);
	console.log("Ball 2: " + parseFloat($("#ball2").css('left')));
	
	
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
			$("#gameArea").show();
			//Show Game Area
			turn = true;	//Player's 1 get's the turn
			alert("Waiting for Opponent");
			console.log("Player 1's turn: " + turn);
		}
		else if(msg == "2" && turn==false){
			alert("Player Accepted! You are player 2");
			$("#play").hide();
			$("#gameArea").show();
			//Show Game Area
			turn = false
			console.log("Player 2's turn: " + turn);
		}
		else{

		}
	});

}

function pressed(){
	if(turn!=false && playing!=false){
		if(event.keyCode == "37"&&!throwing){
			moveLeft("#ball1");
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
	currentPosition = parseFloat($(ball).css('left'));
	// increment = 0;
	if(currentPosition<="-180"){
		$("#ball1").stop(true);
	}
	else{
		// var oldPosition = currentPosition;
		var left = 10;
		$("#ball1").animate({left: "-=" + left + 'px'}, 'fast');
		
		currentPosition = parseFloat($(ball).css('left'));
		incrementLeft = currentPosition - oldPositionLeft;
		alert("Old position: " + oldPositionLeft + " Current Position: " + currentPosition + " increment: " + incrementLeft );
		oldPositionLeft = currentPosition;
		if(ball=="#ball1"){
			// console.log("Move Left");
			socket.emit('move left', incrementLeft);
		}
		console.log(ball +" : " + $(ball).css('left'));
	}	
}

function moveRight(ball){
	currentPosition = parseFloat($(ball).css('left'));
	if(parseFloat($(ball).css('left'))>="180"){
		$("#ball1").stop(true);
	}
	else{
		var left = 10;
		$("#ball1").animate({left: "+=" + left + 'px'}, 'fast');
		
		currentPosition = parseFloat($(ball).css('left'));
		incrementRight = currentPosition - oldPositionRight;
		alert("Old position: " + oldPositionRight + " Current Position: " + currentPosition + " increment: " + incrementRight );
		oldPositionRight = currentPosition;
		if(ball=="#ball1"){
			// console.log("Move Right");
			socket.emit('move right', incrementRight);
		}
		console.log(ball +" : " + $(ball).css('left'));
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
			// socket.emit('move stop');
			// socket.off('move right');
			// socket.off('move left');
			
		}
	}
}