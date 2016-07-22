(function () {
  'use strict';

  angular
    .module('conversations')
    .controller('ConversationsController', ConversationsController);

  ConversationsController.$inject = ['$scope', '$state', 'ConversationsService', 'Admin'];

  function ConversationsController($scope, $state, ConversationsService, Admin) {
    var vm = this;
    vm.conversations = ConversationsService.query();
    vm.users = Admin.query();
  }
})();
