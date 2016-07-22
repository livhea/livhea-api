'use strict';

describe('Affiliate products E2E Tests:', function () {
  describe('Test Affiliate products page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/affiliate-products');
      expect(element.all(by.repeater('affiliate-product in affiliate-products')).count()).toEqual(0);
    });
  });
});
