'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus','Authentication',
  function (Menus, Authentication) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Talk to Coach',
      state: 'privateChat({conversationId: "'+ Authentication.user._id+'"})'
    });
  }
]);
