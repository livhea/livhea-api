'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vital Schema
 */
var VitalSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Vital name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Vital', VitalSchema);
