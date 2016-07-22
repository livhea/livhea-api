(function () {
  'use strict';

  describe('Affiliate products Route Tests', function () {
    // Initialize global variables
    var $scope,
      AffiliateProductsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AffiliateProductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AffiliateProductsService = _AffiliateProductsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('affiliate-products');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/affiliate-products');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AffiliateProductsController,
          mockAffiliateProduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('affiliate-products.view');
          $templateCache.put('modules/affiliate-products/client/views/view-affiliate-product.client.view.html', '');

          // create mock Affiliate product
          mockAffiliateProduct = new AffiliateProductsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Affiliate product Name'
          });

          //Initialize Controller
          AffiliateProductsController = $controller('AffiliateProductsController as vm', {
            $scope: $scope,
            affiliateProductResolve: mockAffiliateProduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:affiliateProductId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.affiliateProductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            affiliateProductId: 1
          })).toEqual('/affiliate-products/1');
        }));

        it('should attach an Affiliate product to the controller scope', function () {
          expect($scope.vm.affiliateProduct._id).toBe(mockAffiliateProduct._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/affiliate-products/client/views/view-affiliate-product.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AffiliateProductsController,
          mockAffiliateProduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('affiliate-products.create');
          $templateCache.put('modules/affiliate-products/client/views/form-affiliate-product.client.view.html', '');

          // create mock Affiliate product
          mockAffiliateProduct = new AffiliateProductsService();

          //Initialize Controller
          AffiliateProductsController = $controller('AffiliateProductsController as vm', {
            $scope: $scope,
            affiliateProductResolve: mockAffiliateProduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.affiliateProductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/affiliate-products/create');
        }));

        it('should attach an Affiliate product to the controller scope', function () {
          expect($scope.vm.affiliateProduct._id).toBe(mockAffiliateProduct._id);
          expect($scope.vm.affiliateProduct._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/affiliate-products/client/views/form-affiliate-product.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AffiliateProductsController,
          mockAffiliateProduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('affiliate-products.edit');
          $templateCache.put('modules/affiliate-products/client/views/form-affiliate-product.client.view.html', '');

          // create mock Affiliate product
          mockAffiliateProduct = new AffiliateProductsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Affiliate product Name'
          });

          //Initialize Controller
          AffiliateProductsController = $controller('AffiliateProductsController as vm', {
            $scope: $scope,
            affiliateProductResolve: mockAffiliateProduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:affiliateProductId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.affiliateProductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            affiliateProductId: 1
          })).toEqual('/affiliate-products/1/edit');
        }));

        it('should attach an Affiliate product to the controller scope', function () {
          expect($scope.vm.affiliateProduct._id).toBe(mockAffiliateProduct._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/affiliate-products/client/views/form-affiliateProduct.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
