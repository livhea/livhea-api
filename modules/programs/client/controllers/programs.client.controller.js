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

    if(typeof vm.program.questionnaire === 'undefined'){
      vm.program.questionnaire = [];
    }

    vm.addSection = function(){
      vm.program.questionnaire.push({
        name: vm.sectionName,
        questions: []
      });
      vm.sectionName = '';
    };

    vm.addQuestion = function(idx){
      vm.program.questionnaire[idx].questions.push({
        title: '',
        label: '',
        type: ''
      });
      $('.ui.dropdown').dropdown();
    };

    vm.removeSection = function(idx){
      vm.program.questionnaire.splice(idx, 1);
    };

    vm.removeQuestion = function(idx, jdx){
      vm.program.questionnaire[idx].questions.splice(jdx, 1);
    };

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

      console.log(isValid);

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
        console.log('success!');
        switch(vm.currentStep){
          case 1:
          case 2:
            stepForward();
            break;
          default:
            $state.go('programs.view', {
              programId: res._id
            });
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
