(function(){
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus', 'Authentication'];

  function menuConfig(Menus, Authentication) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Consult Myra',
      state: 'privateChat({conversationId: "'+ Authentication.user._id+'"})',
      roles: ['user']
    });
  }
})();
