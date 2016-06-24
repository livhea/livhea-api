(function () {
  'use strict';

  // Vitals controller
  angular
    .module('vitals')
    .controller('VitalsController', VitalsController);

  VitalsController.$inject = ['$scope', '$state', 'Authentication', 'vitalResolve'];

  function VitalsController ($scope, $state, Authentication, vital) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vital = vital;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Vital
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.vital.$remove($state.go('vitals.list'));
      }
    }

    // Save Vital
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vitalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vital._id) {
        vm.vital.$update(successCallback, errorCallback);
      } else {
        vm.vital.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vitals.view', {
          vitalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
