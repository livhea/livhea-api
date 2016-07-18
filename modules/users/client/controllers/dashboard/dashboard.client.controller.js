(function () {
  'use strict';

  // Articles controller
  angular
  .module('users')
  .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$state', 'Authentication', 'ProgramsService', 'Users', '$timeout', '$http', 'ArticlesService'];

  function DashboardController ($scope, $state, Authentication, ProgramsService, Users, $timeout, $http, ArticlesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = new Users(Authentication.user);
    vm.error = null;
    vm.form = {};

    vm.initQuestionnaire = initQuestionnaire;
    vm.initProgramList = initProgramList;
    vm.initMyProgram = initMyProgram;
    vm.subscribeToProgram = subscribeToProgram;
    vm.addAnswersToProfile = addAnswersToProfile;
    vm.getBabyTracker = getBabyTracker;
    vm.answers = {};
    //vm.babyTracker = {};

    //Dashboard > Program List
    function initProgramList(){
      ProgramsService.query(function(programs){
        vm.programs = programs;

        $timeout(function(){
          $('.programs.ui.link.cards .image').dimmer({
            on: 'hover'
          });
        },1);

        //Remove already subscribed programs
        vm.programs.forEach(function(entry,idx){
          if(vm.user.programs.indexOf(entry._id) !== -1){
            vm.programs.splice(idx, 1);
          }
        });

      });
    }

    //Dashboard > Selected Program > Questionnaire
    function initQuestionnaire(){
      if(!vm.program){
        vm.program = ProgramsService.get({
          programId: $state.params.programId
        });
      }
      vm.program.$promise.then(function(){
        setupQuestionnaireForEdit();
      });
    }

    //Dashboard > My Program
    function initMyProgram(){
      if(!vm.program){
        vm.program = ProgramsService.get({
          programId: vm.user.programs[0]
        });
      }
    }


    //Dashboard > Selected Program > Subscribe Confirmation
    function subscribeToProgram(program){
      vm.program = program;
      $('.program.ui.modal')
      .modal({
        blurring: true,
        closable  : false,
        onApprove : subscribeAndRedirect
      })
      .modal('show');
    }

    //Dashboard > Selected Program > Subscribe
    function subscribeAndRedirect(){
      vm.user.programs.push(vm.program._id);
      vm.user.$update(function(response){
        Authentication.user = response;
        $state.go('dashboard.questionnaire',{ programId: vm.program._id });
      });
    }

    function addAnswersToProfile(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.questionnaire');
        return false;
      }
      vm.user = new Users(Authentication.user);
      if(!vm.user.hasOwnProperty('programData')){
        vm.user.programData = {};
      }
      vm.user.programData[vm.program._id] = vm.answers;
      vm.user.$update(function(response){
        Authentication.user = response;
        $state.go('dashboard.myProgram');
      });
    }

    function setupQuestionnaireForEdit(){
      if(vm.user.hasOwnProperty('programData')){
        vm.answers = vm.user.programData[vm.program._id];
      }
    }

    function getBabyTracker(){
      if(!vm.program){
        vm.program = ProgramsService.get({
          programId: vm.user.programs[0]
        });
      }
      vm.program.$promise.then(function(){
        vm.babyTracker = ArticlesService.query({ program: vm.program._id, sort: 'title' });
      });
    }

  }
})();
