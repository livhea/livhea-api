'use strict';
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

// Create the chat configuration
module.exports = function (io, socket) {

  socket.on('beginChat', function(message){

    console.log(socket.request.user.displayName + ' Joined - ' + message.conversationId);
    socket.join(message.conversationId);
    //TODO, fetch all messages
  });

  socket.on('endChat', function(message){
    console.log(socket.request.user.displayName + ' Left - ' + message.conversationId);
    socket.leave(message.conversationId);
  });

  socket.on('communicate', function(message){

    var now = Date.now();
    var _message = new Message({
      text: message.text,
      fromUser: message.fromUser,
      toUser: message.toUser,
      created: now,
      conversationId: message.conversationId
    });

    _message.save(function(err){
      if(err) console.error(err);
    });

    message.type = 'message';
    message.created = now;
    message.fromUser = {
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username,
      displayName: socket.request.user.displayName
    };

    io.to(message.conversationId).emit('communicate',message);

  });



};
