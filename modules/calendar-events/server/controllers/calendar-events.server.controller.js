'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Calendar event
 */
exports.create = function(req, res) {
  var calendarEvent = new CalendarEvent(req.body);
  calendarEvent.user = req.user;

  calendarEvent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendarEvent);
    }
  });
};

/**
 * Show the current Calendar event
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var calendarEvent = req.calendarEvent ? req.calendarEvent.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  calendarEvent.isCurrentUserOwner = req.user && calendarEvent.user && calendarEvent.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(calendarEvent);
};

/**
 * Update a Calendar event
 */
exports.update = function(req, res) {
  var calendarEvent = req.calendarEvent ;

  calendarEvent = _.extend(calendarEvent , req.body);

  calendarEvent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendarEvent);
    }
  });
};

/**
 * Delete an Calendar event
 */
exports.delete = function(req, res) {
  var calendarEvent = req.calendarEvent ;

  calendarEvent.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendarEvent);
    }
  });
};

/**
 * List of Calendar events
 */
exports.list = function(req, res) { 
  CalendarEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, calendarEvents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendarEvents);
    }
  });
};

/**
 * Calendar event middleware
 */
exports.calendarEventByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Calendar event is invalid'
    });
  }

  CalendarEvent.findById(id).populate('user', 'displayName').exec(function (err, calendarEvent) {
    if (err) {
      return next(err);
    } else if (!calendarEvent) {
      return res.status(404).send({
        message: 'No Calendar event with that identifier has been found'
      });
    }
    req.calendarEvent = calendarEvent;
    next();
  });
};
