//User programs service used to communicate User programs REST endpoints
(function () {
  'use strict';

  angular
    .module('userPrograms')
    .factory('UserProgramsService', UserProgramsService);

  UserProgramsService.$inject = ['$resource'];

  function UserProgramsService($resource) {
    return $resource('api/user-programs/:userProgramId', {
      userProgramId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
