'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus','Authentication',
  function (Menus, Authentication) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Consult Myra',
      state: 'privateChat({conversationId: "'+ Authentication.user._id+'"})'
    });
  }
]);
