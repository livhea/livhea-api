'use strict';
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('chatMessage', {
  //   type: 'status',
  //   text: 'Is now connected',
  //   created: Date.now(),
  //   profileImageURL: socket.request.user.profileImageURL,
  //   username: socket.request.user.username
  // });


  // Send a chat messages to all connected sockets when a message is received
  // socket.on('chatMessage', function (message) {
  //
  //   message.type = 'message';
  //   message.created = Date.now();
  //   message.profileImageURL = socket.request.user.profileImageURL;
  //   message.username = socket.request.user.username;
  //
  //   // Emit the 'chatMessage' event
  //   io.emit('chatMessage', message);
  // });
  //
  // // Emit the status event when a socket client is disconnected
  // socket.on('disconnect', function () {
  //   io.emit('chatMessage', {
  //     type: 'status',
  //     text: 'disconnected',
  //     created: Date.now(),
  //     username: socket.request.user.username
  //   });
  // });

  socket.on('beginChat', function(message){

    var conversationId = message.fromUser + message.toUser;

    socket.join(conversationId);
    //TODO, fetch all messages
  });

  socket.on('endChat', function(message){
    socket.leave(message.userId);
  });

  socket.on('communicate', function(message){

    var now = Date.now();
    var _message = new Message({
      text: message.text,
      fromUser: message.fromUser,
      toUser: message.toUser,
      created: now,
      conversationId: message.fromUser + message.toUser
    });

    _message.save(function(err){
      if(err) console.error(err);
    });

    message.type = 'message';
    message.created = now;
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    io.emit('communicate',message);

  });



};
