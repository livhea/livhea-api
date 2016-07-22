(function(){

  'use strict';

  angular
    .module('chat')
    .controller('PrivateChatController', PrivateChatController);

  PrivateChatController.$inject = ['$scope', '$location', 'Authentication', 'Socket', '$state', 'ConversationsService', 'Users'];

  function PrivateChatController($scope, $location, Authentication, Socket, $state, ConversationsService, Users){
    var vm = this;

    var conversationId = $state.params.conversationId;

    console.log(new Users(Authentication.user));



    vm.form = {};
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    Socket.emit('beginChat',{
      conversationId: conversationId
    });
    vm.messages = ConversationsService.query({ _id: conversationId });

    // Add an event listener to the 'chatMessage' event
    Socket.on('communicate', function (message) {
      vm.messages.push(message);
    });

    // Create a controller method for sending messages
    vm.communicate = communicate;

    function communicate() {
      // Create a new message object
      var message = {
        text: vm.messageText,
        fromUser: Authentication.user._id,
        conversationId: conversationId
      };

      // Emit a 'chatMessage' message event
      Socket.emit('communicate', message);

      // Clear the message text
      vm.messageText = '';
    }

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('communicate');
      Socket.emit('endChat',{ conversationId: conversationId });
    });

  }
})();
