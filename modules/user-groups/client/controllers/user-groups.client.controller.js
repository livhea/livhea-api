(function () {
  'use strict';

  // User groups controller
  angular
    .module('userGroups')
    .controller('UserGroupsController', UserGroupsController);

  UserGroupsController.$inject = ['$scope', '$state', 'Authentication', 'userGroupResolve'];

  function UserGroupsController ($scope, $state, Authentication, userGroup) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userGroup = userGroup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing User group
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.userGroup.$remove($state.go('user-groups.list'));
      }
    }

    // Save User group
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userGroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userGroup._id) {
        vm.userGroup.$update(successCallback, errorCallback);
      } else {
        vm.userGroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('user-groups.view', {
          userGroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
