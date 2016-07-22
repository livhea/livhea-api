(function () {
  'use strict';

  // Affiliate products controller
  angular
  .module('affiliateProducts')
  .controller('AffiliateProductsController', AffiliateProductsController);

  AffiliateProductsController.$inject = ['$scope', '$state', 'Authentication', 'affiliateProductResolve'];

  function AffiliateProductsController ($scope, $state, Authentication, affiliateProduct) {
    var vm = this;

    vm.authentication = Authentication;
    vm.affiliateProduct = affiliateProduct;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //TODO: Refactor this, move provider to a different module

    if(!vm.affiliateProduct.provider){
      vm.affiliateProduct.provider = 'flipkart';
    }

    // Remove existing Affiliate product
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.affiliateProduct.$remove($state.go('affiliateProducts.list'));
      }
    }

    // Save Affiliate product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.affiliateProductForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.affiliateProduct._id) {
        vm.affiliateProduct.$update(successCallback, errorCallback);
      } else {
        vm.affiliateProduct.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('affiliateProducts.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
