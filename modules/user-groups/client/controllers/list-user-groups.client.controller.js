(function () {
  'use strict';

  angular
    .module('userGroups')
    .controller('UserGroupsListController', UserGroupsListController);

  UserGroupsListController.$inject = ['UserGroupsService'];

  function UserGroupsListController(UserGroupsService) {
    var vm = this;

    vm.userGroups = UserGroupsService.query();
  }
})();
