'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* User program Schema - Join Collection to caputre Program specific details from
* User
*/
var UserProgramSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  program:{
    type: Schema.ObjectId,
    ref: 'Program'
  },
  details:[{
    type: Schema.Types.Mixed
  }]
},{
  timestamps: true
});


mongoose.model('UserProgram', UserProgramSchema);
