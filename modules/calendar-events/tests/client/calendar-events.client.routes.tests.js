(function () {
  'use strict';

  describe('Calendar events Route Tests', function () {
    // Initialize global variables
    var $scope,
      CalendarEventsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CalendarEventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CalendarEventsService = _CalendarEventsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('calendar-events');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/calendar-events');
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
          CalendarEventsController,
          mockCalendarEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('calendar-events.view');
          $templateCache.put('modules/calendar-events/client/views/view-calendar-event.client.view.html', '');

          // create mock Calendar event
          mockCalendarEvent = new CalendarEventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Calendar event Name'
          });

          //Initialize Controller
          CalendarEventsController = $controller('CalendarEventsController as vm', {
            $scope: $scope,
            calendarEventResolve: mockCalendarEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:calendarEventId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.calendarEventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            calendarEventId: 1
          })).toEqual('/calendar-events/1');
        }));

        it('should attach an Calendar event to the controller scope', function () {
          expect($scope.vm.calendarEvent._id).toBe(mockCalendarEvent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/calendar-events/client/views/view-calendar-event.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CalendarEventsController,
          mockCalendarEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('calendar-events.create');
          $templateCache.put('modules/calendar-events/client/views/form-calendar-event.client.view.html', '');

          // create mock Calendar event
          mockCalendarEvent = new CalendarEventsService();

          //Initialize Controller
          CalendarEventsController = $controller('CalendarEventsController as vm', {
            $scope: $scope,
            calendarEventResolve: mockCalendarEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.calendarEventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/calendar-events/create');
        }));

        it('should attach an Calendar event to the controller scope', function () {
          expect($scope.vm.calendarEvent._id).toBe(mockCalendarEvent._id);
          expect($scope.vm.calendarEvent._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/calendar-events/client/views/form-calendar-event.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CalendarEventsController,
          mockCalendarEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('calendar-events.edit');
          $templateCache.put('modules/calendar-events/client/views/form-calendar-event.client.view.html', '');

          // create mock Calendar event
          mockCalendarEvent = new CalendarEventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Calendar event Name'
          });

          //Initialize Controller
          CalendarEventsController = $controller('CalendarEventsController as vm', {
            $scope: $scope,
            calendarEventResolve: mockCalendarEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:calendarEventId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.calendarEventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            calendarEventId: 1
          })).toEqual('/calendar-events/1/edit');
        }));

        it('should attach an Calendar event to the controller scope', function () {
          expect($scope.vm.calendarEvent._id).toBe(mockCalendarEvent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/calendar-events/client/views/form-calendarEvent.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
