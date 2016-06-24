'use strict';

describe('User programs E2E Tests:', function () {
  describe('Test User programs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/user-programs');
      expect(element.all(by.repeater('user-program in user-programs')).count()).toEqual(0);
    });
  });
});
