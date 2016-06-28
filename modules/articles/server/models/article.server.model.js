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
    required: 'Please fill Article name',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  featuredImage: {
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
  url: {
    type: String,
    default: ''
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
  tags:[{
    type: Schema.ObjectId,
    ref: 'Tag'
  }]
},{
  timestamps: true,
  toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ArticleSchema.virtual('excerpt')
  .get(function(){
      return this.content.substring(0,140) + '...';
  });

function slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

ArticleSchema.pre('save', function(next){
    this.url = slugify(this.title); //.substring(0,18);
    next();
});

mongoose.model('Article', ArticleSchema);
