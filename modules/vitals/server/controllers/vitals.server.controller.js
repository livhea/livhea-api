'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vital = mongoose.model('Vital'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Vital
 */
exports.create = function(req, res) {
  var vital = new Vital(req.body);
  vital.user = req.user;

  vital.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vital);
    }
  });
};

/**
 * Show the current Vital
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vital = req.vital ? req.vital.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vital.isCurrentUserOwner = req.user && vital.user && vital.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(vital);
};

/**
 * Update a Vital
 */
exports.update = function(req, res) {
  var vital = req.vital ;

  vital = _.extend(vital , req.body);

  vital.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vital);
    }
  });
};

/**
 * Delete an Vital
 */
exports.delete = function(req, res) {
  var vital = req.vital ;

  vital.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vital);
    }
  });
};

/**
 * List of Vitals
 */
exports.list = function(req, res) { 
  Vital.find().sort('-created').populate('user', 'displayName').exec(function(err, vitals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vitals);
    }
  });
};

/**
 * Vital middleware
 */
exports.vitalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vital is invalid'
    });
  }

  Vital.findById(id).populate('user', 'displayName').exec(function (err, vital) {
    if (err) {
      return next(err);
    } else if (!vital) {
      return res.status(404).send({
        message: 'No Vital with that identifier has been found'
      });
    }
    req.vital = vital;
    next();
  });
};
