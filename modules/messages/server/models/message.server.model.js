'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* Message Schema
*/
var MessageSchema = new Schema({
  text: {
    type: String,
    default: '',
    required: 'Please enter a Message to send',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  fromUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  conversationId: {
    type: String,
    default: ''
  }
});

mongoose.model('Message', MessageSchema);
