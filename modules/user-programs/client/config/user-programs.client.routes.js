(function () {
  'use strict';

  angular
    .module('user-programs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('user-programs', {
        abstract: true,
        url: '/user-programs',
        template: '<ui-view/>'
      })
      .state('user-programs.list', {
        url: '',
        templateUrl: 'modules/user-programs/client/views/list-user-programs.client.view.html',
        controller: 'UserProgramsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'User programs List'
        }
      })
      .state('user-programs.create', {
        url: '/create',
        templateUrl: 'modules/user-programs/client/views/form-user-program.client.view.html',
        controller: 'UserProgramsController',
        controllerAs: 'vm',
        resolve: {
          user-programResolve: newUserProgram
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'User programs Create'
        }
      })
      .state('user-programs.edit', {
        url: '/:userProgramId/edit',
        templateUrl: 'modules/user-programs/client/views/form-user-program.client.view.html',
        controller: 'UserProgramsController',
        controllerAs: 'vm',
        resolve: {
          user-programResolve: getUserProgram
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit User program {{ user-programResolve.name }}'
        }
      })
      .state('user-programs.view', {
        url: '/:userProgramId',
        templateUrl: 'modules/user-programs/client/views/view-user-program.client.view.html',
        controller: 'UserProgramsController',
        controllerAs: 'vm',
        resolve: {
          user-programResolve: getUserProgram
        },
        data:{
          pageTitle: 'User program {{ articleResolve.name }}'
        }
      });
  }

  getUserProgram.$inject = ['$stateParams', 'UserProgramsService'];

  function getUserProgram($stateParams, UserProgramsService) {
    return UserProgramsService.get({
      userProgramId: $stateParams.userProgramId
    }).$promise;
  }

  newUserProgram.$inject = ['UserProgramsService'];

  function newUserProgram(UserProgramsService) {
    return new UserProgramsService();
  }
})();
