'use strict';

// conversations controller
angular.module('conversations').controller('ConversationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'conversations', 'Admin',
  function ($scope, $stateParams, $location, Authentication, conversations, Admin) {
    $scope.authentication = Authentication;

    // Find a list of conversations
    $scope.find = function () {
      $scope.conversations = conversations.query();
    };

    // Find existing conversation
    $scope.findOne = function () {
      $scope.conversation = conversations.get({
        conversationId: $stateParams.conversationId
      });
    };

    $scope.listUsers = function() {
      $scope.users = Admin.query();
    };
  }
]);
