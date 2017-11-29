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

app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/BoxPong.html');
});
	
//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});