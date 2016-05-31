'use strict';

// Create the 'chat' controller
angular.module('chat').controller('PrivateChatController', ['$scope', '$location', 'Authentication', 'Socket', '$state', 'conversations',
function ($scope, $location, Authentication, Socket, $state, conversations) {
  // Create a messages array
  $scope.messages = [];
  $scope.conversationId = undefined;

  // If user is not signed in then redirect back home
  if (!Authentication.user) {
    $location.path('/');
  }

  // Make sure the Socket is connected
  if (!Socket.socket) {
    Socket.connect();
  }

  var init = function(){
    console.log('communicate init');
    $scope.conversationId = $state.params.conversationId || Authentication.user._id;
    Socket.emit('beginChat',{
      conversationId: $scope.conversationId
    });
    $scope.messages = conversations.query({ _id: $scope.conversationId });
  };


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
      conversationId: $scope.conversationId
    };

    // Emit a 'chatMessage' message event
    Socket.emit('communicate', message);

    // Clear the message text
    this.messageText = '';
  };

  // Remove the event listener when the controller instance is destroyed
  $scope.$on('$destroy', function () {
    Socket.removeListener('communicate');
    Socket.emit('endChat',{ conversationId: $scope.conversationId });
  });

  init();
}
]);
