(function () {
  'use strict';

  angular
    .module('userGroups')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'User Groups',
      state: 'userGroups',
      type: 'dropdown',
      roles: ['coach','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'userGroups', {
      title: 'List User Groups',
      state: 'userGroups.list',
      roles: ['coach','admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'userGroups', {
      title: 'Create User Group',
      state: 'userGroups.create',
      roles: ['coach','admin']
    });
  }
})();
