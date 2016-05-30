(function () {
  'use strict';

  describe('User groups Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserGroupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserGroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserGroupsService = _UserGroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('user-groups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/user-groups');
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
          UserGroupsController,
          mockUserGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('user-groups.view');
          $templateCache.put('modules/user-groups/client/views/view-user-group.client.view.html', '');

          // create mock User group
          mockUserGroup = new UserGroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'User group Name'
          });

          //Initialize Controller
          UserGroupsController = $controller('UserGroupsController as vm', {
            $scope: $scope,
            userGroupResolve: mockUserGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userGroupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userGroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userGroupId: 1
          })).toEqual('/user-groups/1');
        }));

        it('should attach an User group to the controller scope', function () {
          expect($scope.vm.userGroup._id).toBe(mockUserGroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/user-groups/client/views/view-user-group.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserGroupsController,
          mockUserGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('user-groups.create');
          $templateCache.put('modules/user-groups/client/views/form-user-group.client.view.html', '');

          // create mock User group
          mockUserGroup = new UserGroupsService();

          //Initialize Controller
          UserGroupsController = $controller('UserGroupsController as vm', {
            $scope: $scope,
            userGroupResolve: mockUserGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userGroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/user-groups/create');
        }));

        it('should attach an User group to the controller scope', function () {
          expect($scope.vm.userGroup._id).toBe(mockUserGroup._id);
          expect($scope.vm.userGroup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/user-groups/client/views/form-user-group.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserGroupsController,
          mockUserGroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('user-groups.edit');
          $templateCache.put('modules/user-groups/client/views/form-user-group.client.view.html', '');

          // create mock User group
          mockUserGroup = new UserGroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'User group Name'
          });

          //Initialize Controller
          UserGroupsController = $controller('UserGroupsController as vm', {
            $scope: $scope,
            userGroupResolve: mockUserGroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userGroupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userGroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userGroupId: 1
          })).toEqual('/user-groups/1/edit');
        }));

        it('should attach an User group to the controller scope', function () {
          expect($scope.vm.userGroup._id).toBe(mockUserGroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/user-groups/client/views/form-userGroup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
