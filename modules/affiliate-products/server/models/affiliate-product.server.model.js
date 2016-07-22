'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
  config = require('../../../../config/config'),
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
  description: {
    type: String,
    default: '',
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

// // Getter
// AffiliateProductSchema.path('price').get(function(num) {
//   return (num / 100).toFixed(2);
// });

// // Setter
// AffiliateProductSchema.path('price').set(function(num) {
//   return num * 100;
// });

AffiliateProductSchema.set('toJSON', {
  transform: function(doc, ret, options) {

    if(ret.provider === 'flipkart'){
      if(ret.url.indexOf(config.flipkart.url_prop) === -1){
        ret.url += '&' + config.flipkart.url_prop + '=' + config.flipkart.affiliate_id;
      }
    }
    return ret;
  }
});

mongoose.model('AffiliateProduct', AffiliateProductSchema);
