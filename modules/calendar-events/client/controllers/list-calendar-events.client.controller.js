(function () {
  'use strict';

  angular
    .module('calendarEvents')
    .controller('CalendarEventsListController', CalendarEventsListController);

  CalendarEventsListController.$inject = ['CalendarEventsService'];

  function CalendarEventsListController(CalendarEventsService) {
    var vm = this;

    vm.calendarEvents = CalendarEventsService.query();
  }
})();
