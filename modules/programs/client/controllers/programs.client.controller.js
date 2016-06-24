(function () {
  'use strict';

  // Programs controller
  angular
    .module('programs')
    .controller('ProgramsController', ProgramsController);

  ProgramsController.$inject = ['$scope', '$state', 'Authentication', 'programResolve'];

  function ProgramsController ($scope, $state, Authentication, program) {
    var vm = this;

    vm.authentication = Authentication;
    vm.program = program;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.stepForward = stepForward;
    vm.stepBackward = stepBackward;
    vm.currentStep = 1;

    function stepForward(){
      vm.currentStep++;
      console.log(vm.currentStep);
    }

    function stepBackward(){
      vm.currentStep--;
      console.log(vm.currentStep);
    }

    // Remove existing Program
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.program.$remove($state.go('programs.list'));
      }
    }

    // Save Program
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.programForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.program._id) {
        vm.program.$update(successCallback, errorCallback);
      } else {
        vm.program.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('programs.view', {
          programId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
