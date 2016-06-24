'use strict';

describe('Vitals E2E Tests:', function () {
  describe('Test Vitals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vitals');
      expect(element.all(by.repeater('vital in vitals')).count()).toEqual(0);
    });
  });
});
