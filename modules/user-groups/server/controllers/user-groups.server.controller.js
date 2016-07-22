'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserGroup = mongoose.model('UserGroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a User group
 */
exports.create = function(req, res) {
  var userGroup = new UserGroup(req.body);
  userGroup.user = req.user;

  userGroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userGroup);
    }
  });
};

/**
 * Show the current User group
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userGroup = req.userGroup ? req.userGroup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userGroup.isCurrentUserOwner = req.user && userGroup.user && userGroup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(userGroup);
};

/**
 * Update a User group
 */
exports.update = function(req, res) {
  var userGroup = req.userGroup ;

  userGroup = _.extend(userGroup , req.body);

  userGroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userGroup);
    }
  });
};

/**
 * Delete an User group
 */
exports.delete = function(req, res) {
  var userGroup = req.userGroup ;

  userGroup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userGroup);
    }
  });
};

/**
 * List of User groups
 */
exports.list = function(req, res) {
  UserGroup.find().sort('-created').populate('users').exec(function(err, userGroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userGroups);
    }
  });
};

/**
 * User group middleware
 */
exports.userGroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User group is invalid'
    });
  }

  UserGroup.findById(id).populate('users').exec(function (err, userGroup) {
    if (err) {
      return next(err);
    } else if (!userGroup) {
      return res.status(404).send({
        message: 'No User group with that identifier has been found'
      });
    }
    req.userGroup = userGroup;
    next();
  });
};
