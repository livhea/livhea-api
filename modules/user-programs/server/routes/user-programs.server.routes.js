'use strict';

/**
 * Module dependencies
 */
var userProgramsPolicy = require('../policies/user-programs.server.policy'),
  userPrograms = require('../controllers/user-programs.server.controller');

module.exports = function(app) {
  // User programs Routes
  app.route('/api/user-programs').all(userProgramsPolicy.isAllowed)
    .get(userPrograms.list)
    .post(userPrograms.create);

  app.route('/api/user-programs/:userProgramId').all(userProgramsPolicy.isAllowed)
    .get(userPrograms.read)
    .put(userPrograms.update)
    .delete(userPrograms.delete);

  // Finish by binding the User program middleware
  app.param('userProgramId', userPrograms.userProgramByID);
};
