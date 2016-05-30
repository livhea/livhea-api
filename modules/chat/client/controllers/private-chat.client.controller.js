'use strict';

// Create the 'chat' controller
angular.module('chat').controller('PrivateChatController', ['$scope', '$location', 'Authentication', 'Socket', '$state',
function ($scope, $location, Authentication, Socket, $state) {
  // Create a messages array
  $scope.messages = [];

  // If user is not signed in then redirect back home
  if (!Authentication.user) {
    $location.path('/');
  }

  // Make sure the Socket is connected
  if (!Socket.socket) {
    Socket.connect();
  }

  var init = function(){
    var conversationId = $state.toParams.conversationId;
  };

  Socket.emit('beginChat',{
    fromUser: Authentication.user._id,
    toUser: $scope.receiver._id
  });

  // Add an event listener to the 'chatMessage' event
  Socket.on('communicate', function (message) {
    $scope.messages.unshift(message);
  });

  // Create a controller method for sending messages
  $scope.communicate = function () {
    // Create a new message object
    var message = {
      text: this.messageText,
      fromUser: Authentication.user._id,
      toUser: $scope.receiver._id
    };

    // Emit a 'chatMessage' message event
    Socket.emit('communicate', message);

    // Clear the message text
    this.messageText = '';
  };

  // Remove the event listener when the controller instance is destroyed
  $scope.$on('$destroy', function () {
    Socket.removeListener('communicate');
    Socket.emit('endChat',{ userId: Authentication.user_id });
  });
}
]);
