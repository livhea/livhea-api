(function () {
  'use strict';

  angular
  .module('affiliateProducts')
  .controller('AffiliateProductsListController', AffiliateProductsListController);

  AffiliateProductsListController.$inject = ['AffiliateProductsService'];

  function AffiliateProductsListController(AffiliateProductsService) {
    var vm = this;

    vm.affiliateProducts = AffiliateProductsService.query();

    vm.affiliateProducts.$promise.then(function(response){
      vm.affiliateProducts = [];
      response.forEach(function(obj){
        var affiliateProduct = AffiliateProductsService.get({affiliateProductId: obj._id});
        affiliateProduct.$promise.then(function(){
          vm.affiliateProducts.push(affiliateProduct);
        });
      });
    });

    vm.click = click;

    function click($event){
        console.log($event);
        $event.preventDefault();
        $('.ui.basic.modal')
        .modal({
          closable  : false,
          onDeny    : function(){
            console.log('Closed');
          },
          onApprove : function() {
            window.open($event.currentTarget.href, '_blank');
          }
        })
        .modal('show');
    }

  }
})();
