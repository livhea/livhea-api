'use strict';

// conversations controller
angular.module('conversations').controller('ConversationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'conversations',
  function ($scope, $stateParams, $location, Authentication, conversations) {
    $scope.authentication = Authentication;

    // Find a list of conversations
    $scope.find = function () {
      $scope.conversations = conversations.query();

      console.log($scope.conversations);
    };

    // Find existing conversation
    $scope.findOne = function () {
      $scope.conversation = conversations.get({
        conversationId: $stateParams.conversationId
      });
    };
  }
]);
