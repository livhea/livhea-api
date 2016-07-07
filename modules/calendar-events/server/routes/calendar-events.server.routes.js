'use strict';

/**
 * Module dependencies
 */
var calendarEventsPolicy = require('../policies/calendar-events.server.policy'),
  calendarEvents = require('../controllers/calendar-events.server.controller');

module.exports = function(app) {
  // Calendar events Routes
  app.route('/api/calendar-events').all(calendarEventsPolicy.isAllowed)
    .get(calendarEvents.list)
    .post(calendarEvents.create);

  app.route('/api/calendar-events/:calendarEventId').all(calendarEventsPolicy.isAllowed)
    .get(calendarEvents.read)
    .put(calendarEvents.update)
    .delete(calendarEvents.delete);

  // Finish by binding the Calendar event middleware
  app.param('calendarEventId', calendarEvents.calendarEventByID);
};
