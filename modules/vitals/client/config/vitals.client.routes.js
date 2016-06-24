(function () {
  'use strict';

  angular
    .module('vitals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vitals', {
        abstract: true,
        url: '/vitals',
        template: '<ui-view/>'
      })
      .state('vitals.list', {
        url: '',
        templateUrl: 'modules/vitals/client/views/list-vitals.client.view.html',
        controller: 'VitalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vitals List'
        }
      })
      .state('vitals.create', {
        url: '/create',
        templateUrl: 'modules/vitals/client/views/form-vital.client.view.html',
        controller: 'VitalsController',
        controllerAs: 'vm',
        resolve: {
          vitalResolve: newVital
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vitals Create'
        }
      })
      .state('vitals.edit', {
        url: '/:vitalId/edit',
        templateUrl: 'modules/vitals/client/views/form-vital.client.view.html',
        controller: 'VitalsController',
        controllerAs: 'vm',
        resolve: {
          vitalResolve: getVital
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vital {{ vitalResolve.name }}'
        }
      })
      .state('vitals.view', {
        url: '/:vitalId',
        templateUrl: 'modules/vitals/client/views/view-vital.client.view.html',
        controller: 'VitalsController',
        controllerAs: 'vm',
        resolve: {
          vitalResolve: getVital
        },
        data:{
          pageTitle: 'Vital {{ articleResolve.name }}'
        }
      });
  }

  getVital.$inject = ['$stateParams', 'VitalsService'];

  function getVital($stateParams, VitalsService) {
    return VitalsService.get({
      vitalId: $stateParams.vitalId
    }).$promise;
  }

  newVital.$inject = ['VitalsService'];

  function newVital(VitalsService) {
    return new VitalsService();
  }
})();
