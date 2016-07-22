(function () {
  'use strict';

  // User groups controller
  angular
    .module('userGroups')
    .controller('UserGroupsController', UserGroupsController);

  UserGroupsController.$inject = ['$scope', '$state', 'Authentication', 'userGroupResolve', 'Users', '$timeout'];

  function UserGroupsController ($scope, $state, Authentication, userGroup, Users, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userGroup = userGroup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.users = Users.query();
    vm.users.$promise.then(function(response){
      var users = [];
      vm.userGroup.users.forEach(function(obj){
        users.push(obj._id);
      });
      vm.userGroup.$promise.then(function(){
        $timeout(function(){
          $('.ui.fluid.multiple.search.dropdown').dropdown('set selected',users);
        },1);
      });
    });

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
        $state.go('userGroups.view', {
          userGroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
