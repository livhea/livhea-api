(function () {
  'use strict';

  angular
    .module('affiliateProducts')
    .controller('AffiliateProductsListController', AffiliateProductsListController);

  AffiliateProductsListController.$inject = ['AffiliateProductsService'];

  function AffiliateProductsListController(AffiliateProductsService) {
    var vm = this;

    vm.affiliateProducts = AffiliateProductsService.query();
  }
})();
