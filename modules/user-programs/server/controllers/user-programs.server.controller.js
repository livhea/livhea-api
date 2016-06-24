'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserProgram = mongoose.model('UserProgram'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a User program
 */
exports.create = function(req, res) {
  var userProgram = new UserProgram(req.body);
  userProgram.user = req.user;

  userProgram.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userProgram);
    }
  });
};

/**
 * Show the current User program
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userProgram = req.userProgram ? req.userProgram.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userProgram.isCurrentUserOwner = req.user && userProgram.user && userProgram.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(userProgram);
};

/**
 * Update a User program
 */
exports.update = function(req, res) {
  var userProgram = req.userProgram ;

  userProgram = _.extend(userProgram , req.body);

  userProgram.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userProgram);
    }
  });
};

/**
 * Delete an User program
 */
exports.delete = function(req, res) {
  var userProgram = req.userProgram ;

  userProgram.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userProgram);
    }
  });
};

/**
 * List of User programs
 */
exports.list = function(req, res) { 
  UserProgram.find().sort('-created').populate('user', 'displayName').exec(function(err, userPrograms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userPrograms);
    }
  });
};

/**
 * User program middleware
 */
exports.userProgramByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User program is invalid'
    });
  }

  UserProgram.findById(id).populate('user', 'displayName').exec(function (err, userProgram) {
    if (err) {
      return next(err);
    } else if (!userProgram) {
      return res.status(404).send({
        message: 'No User program with that identifier has been found'
      });
    }
    req.userProgram = userProgram;
    next();
  });
};
