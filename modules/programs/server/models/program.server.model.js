'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* Program Schema
*/
var ProgramSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Program name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  imageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },

  /**
  * Length of Program In Weeks TODO: Review/Refactor
  */
  duration: {
    type: Number,
    default: 1,
    required: 'Please provide program length in weeks'
  },

  /**
  * Subscription amount associated with a program (Affecting My Coach feature only)
  */
  price: {
    type: Number,
    default: 0
  },

  /**
  * Embedded Schema to capture questionnaire
  */
  questionnaire: [{
    type: Schema.Types.Mixed
  }],

  /**
  * The Timeline of the program TODO: Refactor
  */
  programPlan: [{
    type: Schema.Types.Mixed
  }],

  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

mongoose.model('Program', ProgramSchema);
