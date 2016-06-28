'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
  name: {
    type: String,
    default: '',
  }
},{
  timestamps: true
});

mongoose.model('Tag', TagSchema);
