// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(request , response){
// 	response.sendFile(__dirname + '/public/BoxPong.html');
// });


// io.on('connection', function(socket){
// 	console.log('a user connected');
// 	socket.on('disconnect', function(){
// 		console.log('user disconnected');
// 	});
// });

// http.listen(3000, function(){
// 	console.log('listening on port: 3000');

//  });

var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var numUsers = 0;

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

	socket.on('shot details', function(shotDetails){
		console.log('Force: '+ shotDetails.final_force + " X position: " + shotDetails.x + " Y position: " + shotDetails.y);
		// io.emit('receive', { for: 'everyone' });
	});

	socket.on('disconnect', function(socket){
		console.log("A user disconnected");
		if(numUsers>0){
			numUsers--;
			io.emit('playerDisconnect');
		}
		console.log("# of users connected: " + numUsers);
	});

	socket.on('move left', function(x){
		console.log("move Left Sending to ball 2: " + x);
		console.log("Sending to ball 2: " + x)

		socket.broadcast.emit('mirror left',x);
	});

	socket.on('move right', function(x){
		console.log("move Right sending to ball 2: " + x) ;
		console.log("Sending to ball 2: " + x)

		socket.broadcast.emit('mirror right',x);
	});

	socket.on('move stop', function(){
		socket.broadcast.emit('stop');
	});

});


//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});