'use strict';

/**
 * Module dependencies
 */
var vitalsPolicy = require('../policies/vitals.server.policy'),
  vitals = require('../controllers/vitals.server.controller');

module.exports = function(app) {
  // Vitals Routes
  app.route('/api/vitals').all(vitalsPolicy.isAllowed)
    .get(vitals.list)
    .post(vitals.create);

  app.route('/api/vitals/:vitalId').all(vitalsPolicy.isAllowed)
    .get(vitals.read)
    .put(vitals.update)
    .delete(vitals.delete);

  // Finish by binding the Vital middleware
  app.param('vitalId', vitals.vitalByID);
};
