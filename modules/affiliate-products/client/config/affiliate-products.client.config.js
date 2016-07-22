(function () {
  'use strict';

  angular
    .module('affiliateProducts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Affiliate products',
      state: 'affiliateProducts',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'affiliateProducts', {
      title: 'List Affiliate products',
      state: 'affiliateProducts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'affiliateProducts', {
      title: 'Create Affiliate product',
      state: 'affiliateProducts.create',
      roles: ['user']
    });
  }
})();
