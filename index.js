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
	console.log('a user connected');
	numUsers++
	console.log("# of users connected: " + numUsers);
	socket.on('shot details', function(shotDetails){
		console.log('Force: '+ shotDetails.final_force + " X position: " + shotDetails.x + " Y position: " + shotDetails.y);
		io.emit('receive', { for: 'everyone' });
	});
	socket.on('disconnect', function(socket){
		console.log("A user disconnected");
		numUsers--;
		console.log("# of users connected: " + numUsers);
	})

});




//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});