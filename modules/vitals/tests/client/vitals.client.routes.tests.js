(function () {
  'use strict';

  describe('Vitals Route Tests', function () {
    // Initialize global variables
    var $scope,
      VitalsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VitalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VitalsService = _VitalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('vitals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/vitals');
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
          VitalsController,
          mockVital;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('vitals.view');
          $templateCache.put('modules/vitals/client/views/view-vital.client.view.html', '');

          // create mock Vital
          mockVital = new VitalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vital Name'
          });

          //Initialize Controller
          VitalsController = $controller('VitalsController as vm', {
            $scope: $scope,
            vitalResolve: mockVital
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:vitalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.vitalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            vitalId: 1
          })).toEqual('/vitals/1');
        }));

        it('should attach an Vital to the controller scope', function () {
          expect($scope.vm.vital._id).toBe(mockVital._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/vitals/client/views/view-vital.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VitalsController,
          mockVital;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('vitals.create');
          $templateCache.put('modules/vitals/client/views/form-vital.client.view.html', '');

          // create mock Vital
          mockVital = new VitalsService();

          //Initialize Controller
          VitalsController = $controller('VitalsController as vm', {
            $scope: $scope,
            vitalResolve: mockVital
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.vitalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/vitals/create');
        }));

        it('should attach an Vital to the controller scope', function () {
          expect($scope.vm.vital._id).toBe(mockVital._id);
          expect($scope.vm.vital._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/vitals/client/views/form-vital.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VitalsController,
          mockVital;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('vitals.edit');
          $templateCache.put('modules/vitals/client/views/form-vital.client.view.html', '');

          // create mock Vital
          mockVital = new VitalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vital Name'
          });

          //Initialize Controller
          VitalsController = $controller('VitalsController as vm', {
            $scope: $scope,
            vitalResolve: mockVital
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:vitalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.vitalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            vitalId: 1
          })).toEqual('/vitals/1/edit');
        }));

        it('should attach an Vital to the controller scope', function () {
          expect($scope.vm.vital._id).toBe(mockVital._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/vitals/client/views/form-vital.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
