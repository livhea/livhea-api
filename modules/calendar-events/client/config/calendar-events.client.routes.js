(function () {
  'use strict';

  angular
    .module('calendarEvents')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('calendarEvents', {
        abstract: true,
        url: '/calendar-events',
        template: '<ui-view/>'
      })
      .state('calendarEvents.list', {
        url: '',
        templateUrl: 'modules/calendar-events/client/views/list-calendar-events.client.view.html',
        controller: 'CalendarEventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendar events List'
        }
      })
      .state('calendarEvents.create', {
        url: '/create',
        templateUrl: 'modules/calendar-events/client/views/form-calendar-event.client.view.html',
        controller: 'CalendarEventsController',
        controllerAs: 'vm',
        resolve: {
          calendarEventResolve: newCalendarEvent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Calendar events Create'
        }
      })
      .state('calendarEvents.edit', {
        url: '/:calendarEventId/edit',
        templateUrl: 'modules/calendar-events/client/views/form-calendar-event.client.view.html',
        controller: 'CalendarEventsController',
        controllerAs: 'vm',
        resolve: {
          calendarEventResolve: getCalendarEvent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Calendar event {{ calendarEventResolve.name }}'
        }
      })
      .state('calendarEvents.view', {
        url: '/:calendarEventId',
        templateUrl: 'modules/calendar-events/client/views/view-calendar-event.client.view.html',
        controller: 'CalendarEventsController',
        controllerAs: 'vm',
        resolve: {
          calendarEventResolve: getCalendarEvent
        },
        data:{
          pageTitle: 'Calendar event {{ articleResolve.name }}'
        }
      })
      .state('milestones', {
        url: '/milestones',
        templateUrl: 'modules/calendar-events/client/views/list-calendar-events.client.view.html',
        controller: 'CalendarEventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendar events List'
        }
      });
  }

  getCalendarEvent.$inject = ['$stateParams', 'CalendarEventsService'];

  function getCalendarEvent($stateParams, CalendarEventsService) {
    return CalendarEventsService.get({
      calendarEventId: $stateParams.calendarEventId
    }).$promise;
  }

  newCalendarEvent.$inject = ['CalendarEventsService'];

  function newCalendarEvent(CalendarEventsService) {
    return new CalendarEventsService();
  }
})();
