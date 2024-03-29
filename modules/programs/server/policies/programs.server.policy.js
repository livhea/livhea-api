'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Programs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/programs',
      permissions: '*'
    }, {
      resources: '/api/programs/:programId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/programs',
      permissions: ['get']
    }, {
      resources: '/api/programs/:programId',
      permissions: ['get']
    }]
  }, {
    roles: ['coach'],
    allows: [{
      resources: '/api/programs',
      permissions: ['get']
    }, {
      resources: '/api/programs/:programId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Programs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Program is being processed and the current user created it then allow any manipulation
  if (req.program && req.user && req.program.user && req.program.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
