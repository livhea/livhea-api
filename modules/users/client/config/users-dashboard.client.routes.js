'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
function ($stateProvider) {
  // Users state routing
  $stateProvider
  .state('dashboard', {
    abstract: true,
    url: '/dashboard',
    template: '<ui-view />',
    data: {
      roles: ['user']
    }
  })
  .state('dashboard.questionnaire', {
    url: '/questionnaire/:programId',
    templateUrl: 'modules/users/client/views/dashboard/questionnaire.client.view.html',
    controller: 'DashboardController',
    controllerAs: 'vm',
    data: {
      roles: ['user'],
      pageTitle: 'Questionnaire'
    }
  })
  .state('dashboard.programs', {
    url: '/program-list',
    templateUrl: 'modules/users/client/views/dashboard/program-list.client.view.html',
    controller: 'DashboardController',
    controllerAs: 'vm',
    data: {
      roles: ['user'],
      pageTitle : 'List of Programs'
    }
  })
  .state('dashboard.myProgram', {
    url: '/',
    templateUrl: 'modules/users/client/views/dashboard/my-program.client.view.html',
    controller: 'DashboardController',
    controllerAs: 'vm',
    data: {
      roles: ['user'],
      pageTitle: 'My LivHea'
    }
  });

}]);
