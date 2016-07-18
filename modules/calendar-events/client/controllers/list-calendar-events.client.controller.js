(function () {
  'use strict';

  angular
  .module('calendarEvents')
  .controller('CalendarEventsListController', CalendarEventsListController);

  CalendarEventsListController.$inject = ['CalendarEventsService', 'Authentication'];

  function CalendarEventsListController(CalendarEventsService, Authentication) {
    var vm = this;

    vm.render = renderCalendar;
    vm.user = Authentication.user;
    vm.calendarEvents = CalendarEventsService.query();

    /**
    * Renders a Calendar to a container with id 'calendar'
    */
    function renderCalendar(){
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        selectable: true,
        selectHelper: true,
        eventLimit: true,
        timezone: 'local',
        select: selectDay,
        eventClick: selectEvent,
        eventRender: eventRender

      });

      $('#calendar').find('button').each(function(idx, entry){
        if($(entry).hasClass('fc-prev-button')){
          $(entry).removeClass().addClass('ui icon green button');
          $(entry).children().remove();
          $(entry).append('<i class="caret left icon"></i>');
        }
        else if($(entry).hasClass('fc-next-button')){
          $(entry).removeClass().addClass('ui icon green button');
          $(entry).children().remove();
          $(entry).append('<i class="caret right icon"></i>');
        }else{
          $(entry).removeClass().addClass('ui button').css('text-transform', 'capitalize');
        }
      });
    }

    function selectDay(start, end, jsEvent, view){
      $('.calendar.ui.modal').modal('show');
    }

    function selectEvent(event, jsEvent, view){

    }

    function eventRender(event, element) {

    }
  }
})();
