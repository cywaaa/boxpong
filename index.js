var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var numUsers = 0;
var player1Score = 0;
var player2Score = 0;

app.use(express.static(__dirname + '/'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/BoxPong.html');
});

io.on('connection', function(socket){
	socket.on('add player',function(){
		console.log('a user connected');
		if(numUsers<2){
			numUsers++;
			console.log("# of users connected: " + numUsers);
			io.emit('receive', numUsers);
			if(numUsers==2){
				io.emit('gameStart', "start");
				//Unfinished
			}
		}
		else if(numUsers>2){
			io.emit('receive', 'false');
		}
		else{
		}
	});

  socket.on('shotBall',function(shot){
    console.log("SHOT: "+ shot);
    socket.broadcast.emit('land',shot);
  });

	socket.on('disconnect', function(socket){
		console.log("A user disconnected");
		if(numUsers>0){
			numUsers--;
			io.emit('playerDisconnect');
		}
		console.log("# of users connected: " + numUsers);
	});


  socket.on('moveBall',function(x){
      this.x=(-x);
      console.log("Sending coordinates: "+ this.x);
      socket.broadcast.emit('mirror',this.x);
  });

	socket.on('move stop', function(){
		socket.broadcast.emit('stop');
	});

  socket.on('changeTurn', function(){
		socket.broadcast.emit('turn');
	});

  socket.on('hit', function(hitDetails){
     if(hitDetails.player == 1){
       player1Score++;
       console.log("Player 1 scores!!!! Player 1 score: " + player1Score);
       socket.broadcast.emit('mirrorBox', hitDetails.boxId);
      }
      else{
        player2Score++;
        console.log("Player 2 scores!!!! Player 2 score: " + player2Score);
        socket.broadcast.emit('mirrorBox', hitDetails.boxId)
      }
      if(player1Score == 10){
        socket.emit('gameEnd');
        console.log("Player 1 wins!")
      }
      else if(player2Score == 10){
        socket.emit('gameEnd');
        console.log("Player 2 wins!");
      }
      else{

      }
      console.log("Hit on box: " + hitDetails.boxId);
  });

});


//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});
