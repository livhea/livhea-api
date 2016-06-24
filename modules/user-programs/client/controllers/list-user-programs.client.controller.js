(function () {
  'use strict';

  angular
    .module('user-programs')
    .controller('UserProgramsListController', UserProgramsListController);

  UserProgramsListController.$inject = ['UserProgramsService'];

  function UserProgramsListController(UserProgramsService) {
    var vm = this;

    vm.userPrograms = UserProgramsService.query();
  }
})();
