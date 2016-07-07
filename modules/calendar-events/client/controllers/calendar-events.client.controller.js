(function () {
  'use strict';

  // Calendar events controller
  angular
    .module('calendarEvents')
    .controller('CalendarEventsController', CalendarEventsController);

  CalendarEventsController.$inject = ['$scope', '$state', 'Authentication', 'calendarEventResolve'];

  function CalendarEventsController ($scope, $state, Authentication, calendarEvent) {
    var vm = this;

    vm.authentication = Authentication;
    vm.calendarEvent = calendarEvent;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Calendar event
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.calendarEvent.$remove($state.go('calendarEvents.list'));
      }
    }

    // Save Calendar event
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarEventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.calendarEvent._id) {
        vm.calendarEvent.$update(successCallback, errorCallback);
      } else {
        vm.calendarEvent.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('calendarEvents.view', {
          calendarEventId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
