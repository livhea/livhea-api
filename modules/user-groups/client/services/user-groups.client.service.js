//User groups service used to communicate User groups REST endpoints
(function () {
  'use strict';

  angular
    .module('userGroups')
    .factory('UserGroupsService', UserGroupsService);

  UserGroupsService.$inject = ['$resource'];

  function UserGroupsService($resource) {
    return $resource('api/user-groups/:userGroupId', {
      userGroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
