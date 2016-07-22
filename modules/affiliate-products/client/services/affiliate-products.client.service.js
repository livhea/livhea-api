//Affiliate products service used to communicate Affiliate products REST endpoints
(function () {
  'use strict';

  angular
    .module('affiliateProducts')
    .factory('AffiliateProductsService', AffiliateProductsService);

  AffiliateProductsService.$inject = ['$resource'];

  function AffiliateProductsService($resource) {
    return $resource('api/affiliate-products/:affiliateProductId', {
      affiliateProductId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
