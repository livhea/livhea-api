'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
function ($scope, Authentication) {
  $scope.user = Authentication.user;

  function renderCalendar(){
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      theme: true,
      // fixedWeekCount: false,
      // selectable: true,
      // selectHelper: true,
      // eventLimit: true,
      // timezone: 'local',
      select: function(){
        console.log('Event Selected');
      },
      eventClick: function(){
        console.log('Clicked');
      }
    });
  }


  $scope.render = renderCalendar;

}
]);
