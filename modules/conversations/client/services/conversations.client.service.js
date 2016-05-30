'use strict';

//conversations service used for communicating with the conversations REST endpoints
angular.module('conversations').factory('conversations', ['$resource',
  function ($resource) {
    return $resource('api/conversations/:conversationId', {
      conversationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
