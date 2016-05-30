'use strict';

describe('User groups E2E Tests:', function () {
  describe('Test User groups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/user-groups');
      expect(element.all(by.repeater('user-group in user-groups')).count()).toEqual(0);
    });
  });
});
