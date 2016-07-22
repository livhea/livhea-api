'use strict';
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

// Create the chat configuration
module.exports = function (io, socket) {

  socket.on('beginBroadcast', function(message){

    console.log(socket.request.user.displayName + ' Joined - ' + message.userGroupId);
    socket.join(message.userGroupId);
    //TODO, fetch all messages
  });

  socket.on('endBroadcast', function(message){
    console.log(socket.request.user.displayName + ' Left - ' + message.userGroupId);
    socket.leave(message.userGroupId);
  });

  socket.on('broadcastMessage', function(message){

    var now = Date.now();
    var _message = new Message({
      text: message.text,
      fromUser: message.fromUser,
      toUser: message.toUser,
      userGroupId: message.userGroupId
    });

    _message.save(function(err){
      if(err) console.error(err);
      else{
        var messageJSON = JSON.parse(JSON.stringify(_message));
        messageJSON.fromUser = {
          profileImageURL: socket.request.user.profileImageURL,
          username: socket.request.user.username,
          displayName: socket.request.user.displayName
        };
        io.to(message.userGroupId).emit('broadcastMessage',messageJSON);
      }
    });
  });
};
