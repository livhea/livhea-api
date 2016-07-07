'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Calendar event Schema
 */
var CalendarEventSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Calendar event name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  forDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CalendarEvent', CalendarEventSchema);
