(function(){

  'use strict';

  angular
    .module('chat')
    .controller('BroadcastController', BroadcastController);

  BroadcastController.$inject = ['$scope', '$location', 'Authentication', 'Socket', '$state', 'ConversationsService'];

  function BroadcastController($scope, $location, Authentication, Socket, $state, ConversationsService){
    var vm = this;

    vm.form = {};
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    Socket.emit('beginBroadcast',{
      userGroupId: $state.params.userGroupId
    });
    vm.messages = ConversationsService.query({ userGroupId: $state.params.userGroupId });

    // Add an event listener to the 'chatMessage' event
    Socket.on('broadcastMessage', function (message) {
      vm.messages.push(message);
    });

    // Create a controller method for sending messages
    vm.communicate = communicate;

    function communicate() {
      // Create a new message object
      var message = {
        text: vm.messageText,
        fromUser: Authentication.user._id,
        userGroupId: $state.params.userGroupId
      };

      // Emit a 'chatMessage' message event
      Socket.emit('broadcastMessage', message);

      // Clear the message text
      vm.messageText = '';
    }

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('broadcastMessage');
      Socket.emit('endBroadcast',{ conversationId: $state.params.userGroupId });
    });

  }
})();
