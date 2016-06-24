'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  program: {
    type: Schema.ObjectId,
    ref: 'Program'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  /**
  *  Presentation style of the article
  */
  display: {
    type: String,
    enum: ['audio', 'video', 'text', 'image', 'html' ,'mixed'],
    default: 'html',
    trim: true,
    required: 'Display type cannot be blank'
  },

  /**
  * Taxonomy to enable classification compliant to REST standards
  */
  taxonomy:[{
    type: Schema.Types.Mixed
  }]
},{
  timestamps: true
});

mongoose.model('Article', ArticleSchema);
