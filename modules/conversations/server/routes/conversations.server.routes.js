'use strict';

/**
 * Module dependencies.
 */
var conversationsPolicy = require('../policies/conversations.server.policy'),
  conversations = require('../controllers/conversations.server.controller');

module.exports = function (app) {
  // conversations collection routes
  app.route('/api/conversations').all(conversationsPolicy.isAllowed)
    .get(conversations.list);

  // Single conversation routes
  app.route('/api/conversations/:conversationId').all(conversationsPolicy.isAllowed)
    .get(conversations.read);

  // Finish by binding the conversation middleware
  app.param('conversationId', conversations.conversationByID);
};
