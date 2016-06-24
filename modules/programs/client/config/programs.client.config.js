'use strict';
// Configuring the conversations module
angular.module('programs').run(['Menus',
  function (Menus) {
    // Add the conversations dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Programs',
      state: 'programs',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'programs', {
      title: 'List Programs',
      state: 'programs.list'
    });

    Menus.addSubMenuItem('topbar', 'programs', {
      title: 'Create a Program',
      state: 'programs.create'
    });

  }
]);
