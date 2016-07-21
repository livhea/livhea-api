(function () {
  'use strict';

  angular
    .module('affiliateProducts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('affiliateProducts', {
        abstract: true,
        url: '/affiliate-products',
        template: '<ui-view/>'
      })
      .state('affiliateProducts.list', {
        url: '',
        templateUrl: 'modules/affiliate-products/client/views/list-affiliate-products.client.view.html',
        controller: 'AffiliateProductsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Affiliate products List'
        }
      })
      .state('affiliateProducts.create', {
        url: '/create',
        templateUrl: 'modules/affiliate-products/client/views/form-affiliate-product.client.view.html',
        controller: 'AffiliateProductsController',
        controllerAs: 'vm',
        resolve: {
          affiliateProductResolve: newAffiliateProduct
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Affiliate products Create'
        }
      })
      .state('affiliateProducts.edit', {
        url: '/:affiliateProductId/edit',
        templateUrl: 'modules/affiliate-products/client/views/form-affiliate-product.client.view.html',
        controller: 'AffiliateProductsController',
        controllerAs: 'vm',
        resolve: {
          affiliateProductResolve: getAffiliateProduct
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Affiliate product {{ affiliate-productResolve.name }}'
        }
      })
      .state('affiliateProducts.view', {
        url: '/:affiliateProductId',
        templateUrl: 'modules/affiliate-products/client/views/view-affiliate-product.client.view.html',
        controller: 'AffiliateProductsController',
        controllerAs: 'vm',
        resolve: {
          affiliateProductResolve: getAffiliateProduct
        },
        data:{
          pageTitle: 'Affiliate product {{ articleResolve.name }}'
        }
      });
  }

  getAffiliateProduct.$inject = ['$stateParams', 'AffiliateProductsService'];

  function getAffiliateProduct($stateParams, AffiliateProductsService) {
    return AffiliateProductsService.get({
      affiliateProductId: $stateParams.affiliateProductId
    }).$promise;
  }

  newAffiliateProduct.$inject = ['AffiliateProductsService'];

  function newAffiliateProduct(AffiliateProductsService) {
    return new AffiliateProductsService();
  }
})();
