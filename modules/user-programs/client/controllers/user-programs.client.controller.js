(function () {
  'use strict';

  // User programs controller
  angular
    .module('user-programs')
    .controller('UserProgramsController', UserProgramsController);

  UserProgramsController.$inject = ['$scope', '$state', 'Authentication', 'userProgramResolve'];

  function UserProgramsController ($scope, $state, Authentication, userProgram) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userProgram = userProgram;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing User program
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.userProgram.$remove($state.go('user-programs.list'));
      }
    }

    // Save User program
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userProgramForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userProgram._id) {
        vm.userProgram.$update(successCallback, errorCallback);
      } else {
        vm.userProgram.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('user-programs.view', {
          userProgramId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
