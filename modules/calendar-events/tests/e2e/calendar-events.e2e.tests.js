'use strict';

describe('Calendar events E2E Tests:', function () {
  describe('Test Calendar events page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/calendar-events');
      expect(element.all(by.repeater('calendar-event in calendar-events')).count()).toEqual(0);
    });
  });
});
