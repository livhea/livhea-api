//Calendar events service used to communicate Calendar events REST endpoints
(function () {
  'use strict';

  angular
    .module('calendarEvents')
    .factory('CalendarEventsService', CalendarEventsService);

  CalendarEventsService.$inject = ['$resource'];

  function CalendarEventsService($resource) {
    return $resource('api/calendar-events/:calendarEventId', {
      calendarEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
