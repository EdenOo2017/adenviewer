'use strict';

var app = require('./server/server');

 var server = require('http').createServer(app)
 var io = require('socket.io').listen(server);

server.listen(app.get('port'), function () {
  if (process.env.FORGE_CLIENT_ID !== null || process.env.FORGE_CLIENT_SECRET !== null)
    console.log('Server listening on port ' + server.address().port);
});

var clientio = require('socket.io-client');
var client = clientio('https://polar-mesa-97572.herokuapp.com/');

io.sockets.on('connection', function (socket) {
  console.log('connected!')

  client.on('status1', function (STATUS1) {    
    socket.emit('st1', STATUS1);
  });

  client.on('status2', function (STATUS2) {   
    socket.emit('st2', STATUS2);
  });

  client.on('status3', function (STATUS3) {    
    socket.emit('st3', STATUS3);
  });

  client.on('status4', function (STATUS4) {    
    socket.emit('st4', STATUS4);
  });

  client.on('status5', function (STATUS5) {    
    socket.emit('st5', STATUS5);
  });
});

