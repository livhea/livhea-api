'use strict';

// Setting up route
angular.module('conversations').config(['$stateProvider',
  function ($stateProvider) {
    // conversations state routing
    $stateProvider
      .state('conversations', {
        abstract: true,
        url: '/conversations',
        template: '<ui-view/>'
      })
      .state('conversations.list', {
        url: '',
        templateUrl: 'modules/conversations/client/views/list-conversations.client.view.html',
        data: {
          roles: ['coach', 'admin']
        }
      });
  }
]);
