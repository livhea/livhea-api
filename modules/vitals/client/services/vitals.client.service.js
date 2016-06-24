//Vitals service used to communicate Vitals REST endpoints
(function () {
  'use strict';

  angular
    .module('vitals')
    .factory('VitalsService', VitalsService);

  VitalsService.$inject = ['$resource'];

  function VitalsService($resource) {
    return $resource('api/vitals/:vitalId', {
      vitalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
