'use strict';

// Configuring the conversations module
angular.module('conversations').run(['Menus',
  function (Menus) {
    // Add the conversations dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Conversations',
      state: 'conversations',
      type: 'dropdown',
      roles: ['coach','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'conversations', {
      title: 'List Conversations',
      state: 'conversations.list'
    });

  }
]);
