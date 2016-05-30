'use strict';

/**
 * Module dependencies
 */
var userGroupsPolicy = require('../policies/user-groups.server.policy'),
  userGroups = require('../controllers/user-groups.server.controller');

module.exports = function(app) {
  // User groups Routes
  app.route('/api/user-groups').all(userGroupsPolicy.isAllowed)
    .get(userGroups.list)
    .post(userGroups.create);

  app.route('/api/user-groups/:userGroupId').all(userGroupsPolicy.isAllowed)
    .get(userGroups.read)
    .put(userGroups.update)
    .delete(userGroups.delete);

  // Finish by binding the User group middleware
  app.param('userGroupId', userGroups.userGroupByID);
};
