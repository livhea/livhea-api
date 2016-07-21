'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Affiliate product Schema
 */
var AffiliateProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Affiliate product name',
    trim: true
  },
  imageUrl:{
    type: String
  },
  price:{
    type: Number,
    default: 0.00
  },
  url: {
    type: String
  },
  provider:{
    type: String,
    default: 'flipkart'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

// Getter
AffiliateProductSchema.path('price').get(function(num) {
  return (num / 100).toFixed(2);
});

// Setter
AffiliateProductSchema.path('price').set(function(num) {
  return num * 100;
});

mongoose.model('AffiliateProduct', AffiliateProductSchema);
