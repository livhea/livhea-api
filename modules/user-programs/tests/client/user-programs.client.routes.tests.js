(function () {
  'use strict';

  describe('User programs Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserProgramsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserProgramsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserProgramsService = _UserProgramsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('user-programs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/user-programs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserProgramsController,
          mockUserProgram;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('user-programs.view');
          $templateCache.put('modules/user-programs/client/views/view-user-program.client.view.html', '');

          // create mock User program
          mockUserProgram = new UserProgramsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'User program Name'
          });

          //Initialize Controller
          UserProgramsController = $controller('UserProgramsController as vm', {
            $scope: $scope,
            userProgramResolve: mockUserProgram
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userProgramId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userProgramResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userProgramId: 1
          })).toEqual('/user-programs/1');
        }));

        it('should attach an User program to the controller scope', function () {
          expect($scope.vm.userProgram._id).toBe(mockUserProgram._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/user-programs/client/views/view-user-program.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserProgramsController,
          mockUserProgram;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('user-programs.create');
          $templateCache.put('modules/user-programs/client/views/form-user-program.client.view.html', '');

          // create mock User program
          mockUserProgram = new UserProgramsService();

          //Initialize Controller
          UserProgramsController = $controller('UserProgramsController as vm', {
            $scope: $scope,
            userProgramResolve: mockUserProgram
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userProgramResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/user-programs/create');
        }));

        it('should attach an User program to the controller scope', function () {
          expect($scope.vm.userProgram._id).toBe(mockUserProgram._id);
          expect($scope.vm.userProgram._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/user-programs/client/views/form-user-program.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserProgramsController,
          mockUserProgram;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('user-programs.edit');
          $templateCache.put('modules/user-programs/client/views/form-user-program.client.view.html', '');

          // create mock User program
          mockUserProgram = new UserProgramsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'User program Name'
          });

          //Initialize Controller
          UserProgramsController = $controller('UserProgramsController as vm', {
            $scope: $scope,
            userProgramResolve: mockUserProgram
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userProgramId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userProgramResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userProgramId: 1
          })).toEqual('/user-programs/1/edit');
        }));

        it('should attach an User program to the controller scope', function () {
          expect($scope.vm.userProgram._id).toBe(mockUserProgram._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/user-programs/client/views/form-userProgram.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
