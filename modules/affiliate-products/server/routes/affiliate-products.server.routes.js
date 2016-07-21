'use strict';

/**
 * Module dependencies
 */
var affiliateProductsPolicy = require('../policies/affiliate-products.server.policy'),
  affiliateProducts = require('../controllers/affiliate-products.server.controller');

module.exports = function(app) {
  // Affiliate products Routes
  app.route('/api/affiliate-products').all(affiliateProductsPolicy.isAllowed)
    .get(affiliateProducts.list)
    .post(affiliateProducts.create);

  app.route('/api/affiliate-products/:affiliateProductId').all(affiliateProductsPolicy.isAllowed)
    .get(affiliateProducts.read)
    .put(affiliateProducts.update)
    .delete(affiliateProducts.delete);

  // Finish by binding the Affiliate product middleware
  app.param('affiliateProductId', affiliateProducts.affiliateProductByID);
};
