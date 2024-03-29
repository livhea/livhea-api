(function () {
  'use strict';

  angular
    .module('conversations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
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

    Menus.addSubMenuItem('topbar', 'conversations', {
      title: 'List All Users',
      state: 'conversations.users'
    });

  }
})();
