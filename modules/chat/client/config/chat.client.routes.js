(function(){

  'use strict';

  angular
  .module('chat')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider){
    $stateProvider
    .state('privateChat', {
      url: '/consult-myra/:conversationId',
      templateUrl: 'modules/chat/client/views/private-chat.client.view.html',
      controller: 'PrivateChatController',
      controllerAs: 'vm',
      data: {
        roles: ['user','coach','admin']
      }
    });
  }
})();
