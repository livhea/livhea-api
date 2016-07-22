(function () {
  'use strict';

  angular
    .module('conversations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('conversations', {
      abstract: true,
      url: '/conversations',
      template: '<ui-view/>'
    })
    .state('conversations.list', {
      url: '',
      templateUrl: 'modules/conversations/client/views/list-conversations.client.view.html',
      controller: 'ConversationsController',
      controllerAs: 'vm',
      data: {
        roles: ['coach', 'admin']
      }
    })
    .state('conversations.users', {
      url: '/users',
      templateUrl: 'modules/conversations/client/views/list-users.client.view.html',
      controller: 'ConversationsController',
      controllerAs: 'vm',
      data: {
        roles: ['coach', 'admin']
      }
    });
  }
})();
