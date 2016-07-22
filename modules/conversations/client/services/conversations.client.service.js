(function(){

  'use strict';

  angular
  .module('conversations')
  .factory('ConversationsService', ConversationsService);

  ConversationsService.$inject = ['$resource'];

  //conversations service used for communicating with the conversations REST endpoints
  function ConversationsService($resource) {
    return $resource('api/conversations/:conversationId', {
      conversationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
