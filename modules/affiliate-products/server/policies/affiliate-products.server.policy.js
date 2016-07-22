'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Affiliate products Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/affiliate-products',
      permissions: '*'
    }, {
      resources: '/api/affiliate-products/:affiliateProductId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/affiliate-products',
      permissions: ['get', 'post']
    }, {
      resources: '/api/affiliate-products/:affiliateProductId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/affiliate-products',
      permissions: ['get']
    }, {
      resources: '/api/affiliate-products/:affiliateProductId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Affiliate products Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Affiliate product is being processed and the current user created it then allow any manipulation
  if (req.affiliateProduct && req.user && req.affiliateProduct.user && req.affiliateProduct.user.id === req.user.id) {
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
