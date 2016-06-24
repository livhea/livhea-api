'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* User group Schema
*/
var UserGroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill User group name',
    trim: true
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
},{
  timestamps: true
});

mongoose.model('UserGroup', UserGroupSchema);
