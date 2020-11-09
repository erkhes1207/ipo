var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/', function(req, res){
//     res.send(__dirname + '/views/push.hbs');
// });

var userCount = 0;
// var clientUsername = "hello";
io.sockets.on('connection', function(socket){

    userCount++;
    io.sockets.emit('userCount', {userCount: userCount});

    socket.on('disconnect', function(){
        // userCount--;
        // io.sockets.emit('userCount', {userCount: userCount, clientUsername: clientUsername});
        console.log('disconnect');
    })
})

module.exports = app;