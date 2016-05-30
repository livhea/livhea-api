(function () {
  'use strict';

  angular
    .module('userGroups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userGroups', {
        abstract: true,
        url: '/user-groups',
        template: '<ui-view/>'
      })
      .state('userGroups.list', {
        url: '',
        templateUrl: 'modules/user-groups/client/views/list-user-groups.client.view.html',
        controller: 'UserGroupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'User groups List'
        }
      })
      .state('userGroups.create', {
        url: '/create',
        templateUrl: 'modules/user-groups/client/views/form-user-group.client.view.html',
        controller: 'UserGroupsController',
        controllerAs: 'vm',
        resolve: {
          userGroupResolve: newUserGroup
        },
        data: {
          roles: ['coach', 'admin'],
          pageTitle : 'User groups Create'
        }
      })
      .state('userGroups.edit', {
        url: '/:userGroupId/edit',
        templateUrl: 'modules/user-groups/client/views/form-user-group.client.view.html',
        controller: 'UserGroupsController',
        controllerAs: 'vm',
        resolve: {
          userGroupResolve: getUserGroup
        },
        data: {
          roles: ['coach', 'admin'],
          pageTitle: 'Edit User group {{ user-groupResolve.name }}'
        }
      })
      .state('userGroups.view', {
        url: '/:userGroupId',
        templateUrl: 'modules/user-groups/client/views/view-user-group.client.view.html',
        controller: 'UserGroupsController',
        controllerAs: 'vm',
        resolve: {
          userGroupResolve: getUserGroup
        },
        data:{
          pageTitle: 'User group {{ articleResolve.name }}'
        }
      });
  }

  getUserGroup.$inject = ['$stateParams', 'UserGroupsService'];

  function getUserGroup($stateParams, UserGroupsService) {
    return UserGroupsService.get({
      userGroupId: $stateParams.userGroupId
    }).$promise;
  }

  newUserGroup.$inject = ['UserGroupsService'];

  function newUserGroup(UserGroupsService) {
    return new UserGroupsService();
  }
})();
