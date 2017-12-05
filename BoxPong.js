window.onload = initialize;
$(document).ready(function(){
	gameChanges();
});
var socket = io();


function initialize(){
	var elem = document.getElementById("force");
	window.force = 0;
	window.oldPosition = 0;
	window.throwing = false;
	window.down = false;
	window.turn = false;
	window.playing = false;
	window.opponentBoxes = [];
	document.onkeydown = pressed;
	document.onkeyup = released;
	window.player = 0;

}

function Box(id, posX, posY){
	this.id = id;
	this.x = posX;
	this.y = posY;
	this.hit = false;
}

function initBoxes(){
	var boxes1 = document.getElementsByClassName('boxes1');
	for(x=0; x<boxes1.length; x++){
		box = new Box(boxes1[x].id, $("#" + boxes1[x].id).position().left, $("#" + boxes1[x].id).position().top);
		opponentBoxes.push(box);
	}
	console.log(opponentBoxes);
}

// ON READY GAME CHANGES
function gameChanges(){

	$("#img").on('click', function(e){
		if(turn!=false && playing!=false && throwing==false){
			var x = e.pageX - this.offsetLeft;
			if(x>=350){
				x=350;
			}
			newPosition = x-180;
			moveBall(newPosition);
		}
	});

	socket.on('mirror', function(x){

		$("#ball2").animate({left: x + "px"}, 'fast');
	});

	socket.on('land', function(shot){
		$("#ball2").animate({top: shot + "px"}, 1000);
	});

	socket.on('turn', function(){
		throwing = false;
		turn = true;
		$("#ball2").animate({top: 0 + "px"}, 1000);
		$("#ball2").animate({left: 0 + "px"}, 1000);
		alert(" Your turn! ");
	})

	socket.on('mirrorBox', function(boxId){

			mirrorBoxId = boxId.toString() + boxId.toString() ;
			console.log("mirror box " + mirrorBoxId);
			$("#box" + mirrorBoxId).hide();
	})

	socket.on('gameStart', function(){
		playing = true;
		initBoxes();
	});
	socket.on('playerDisconnect', function(){
		if(playing!=false){
			playing = false;
			alert("Opponent had disconnected. Game will be terminated");
			location.reload();
		}

	});
	socket.on('gameEnd', function(){
		playing = false;
	});

}
//END OF ON READY GAME CHANGES

$( document ).ready(function() {
			    $('#name').change(function(){
			        $('#message').html('Hello ' + $('#name').val());
			    });
			});

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
			document.getElementById('start').style.display = "none";


			$("#play").on("submit", function() {
				$('#name').html('Hello ' + $('#input_id').val());
			});
			//Show Game Area
			turn = true;	//Player's 1 get's the turn
			// while(playing==false){
				 alert("Waiting for Opponent");

			// }
			console.log("Player 1's turn: " + turn);
			window.player = 1;
		}
		else if(msg == "2" && turn==false){
			alert("Player Accepted! You are player 2");
			$("#play").hide();
			$("#gameArea").show();
			document.getElementById('start').style.display = "none";

			//Show Game Area
			turn = false
			console.log("Player 2's turn: " + turn);
			window.player = 2;
		}
		else{

		}
	});
}

function pressed(){
	if(turn!=false && playing!=false){
		if(event.keyCode =="16"){
			throwing = true;
			console.log("Shift");//or if Space 32
			shoot();
		}
	}
}

function moveBall(x){
	$("#ball1").animate({left: x + "px"}, 'fast');
	socket.emit('moveBall', x);
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

			socket.emit('shotBall', distance);
			$("#ball1").animate({top: (-distance) + 'px'},1000, function() {
       console.log("Ball position: Left: " + $("#ball1").position().left + " Top: " + $("#ball1").position().top);
			 socket.emit('changeTurn');
			 var ballPosition = {
 				x: $("#ball1").position().left + 180,
 				y: $("#ball1").position().top + 10
 			};
			//var landed = $("#ball1").position().top;

			console.log($("#ball1").position().top);
 			checkHit(ballPosition);
  		});

			throwing = false; //TO MOVE
			console.log('final_force: '+ final_force);
			var shotDetails = {
				final_force : final_force,
				x : x,
				y : y
			};
			//console.log("Ball position X : " + ballPosition.x + "Ball position Y : " + ballPosition.y);
			$("#ball1").animate({top: 0 + "px"}, 1000);
			$("#ball1").animate({left: 0 + "px"}, 1000);
		}
		else{
			$('#ball1').stop(true);
		}
		turn = false;

	}
}

function checkHit(ballPosition){
	for(x=0; x<opponentBoxes.length; x++){
		if(ballPosition.y>= (opponentBoxes[x].y + 5) && ballPosition.y<=((opponentBoxes[x].y + 40) - 15)
				&&(ballPosition.x>=(opponentBoxes[x].x + 5) && ballPosition.x<=(opponentBoxes[x].x + 40)-15)
					&& opponentBoxes[x].hit == false){
						$('#' + opponentBoxes[x].id).hide();
						opponentBoxes[x].hit = true;
						var hitDetails  = {
							player : window.player,
							boxId : x
						};
						socket.emit('hit',hitDetails);
		}
	}
}
