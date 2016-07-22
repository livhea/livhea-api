'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  AffiliateProduct = mongoose.model('AffiliateProduct'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Affiliate product
 */
exports.create = function(req, res) {
  var affiliateProduct = new AffiliateProduct(req.body);
  affiliateProduct.user = req.user;

  affiliateProduct.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(affiliateProduct);
    }
  });
};

/**
 * Show the current Affiliate product
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var affiliateProduct = req.affiliateProduct ? req.affiliateProduct.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  affiliateProduct.isCurrentUserOwner = req.user && affiliateProduct.user && affiliateProduct.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(affiliateProduct);
};

/**
 * Update a Affiliate product
 */
exports.update = function(req, res) {
  var affiliateProduct = req.affiliateProduct ;

  affiliateProduct = _.extend(affiliateProduct , req.body);

  affiliateProduct.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(affiliateProduct);
    }
  });
};

/**
 * Delete an Affiliate product
 */
exports.delete = function(req, res) {
  var affiliateProduct = req.affiliateProduct ;

  affiliateProduct.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(affiliateProduct);
    }
  });
};

/**
 * List of Affiliate products
 */
exports.list = function(req, res) { 
  AffiliateProduct.find().sort('-created').populate('user', 'displayName').exec(function(err, affiliateProducts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(affiliateProducts);
    }
  });
};

/**
 * Affiliate product middleware
 */
exports.affiliateProductByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Affiliate product is invalid'
    });
  }

  AffiliateProduct.findById(id).populate('user', 'displayName').exec(function (err, affiliateProduct) {
    if (err) {
      return next(err);
    } else if (!affiliateProduct) {
      return res.status(404).send({
        message: 'No Affiliate product with that identifier has been found'
      });
    }
    req.affiliateProduct = affiliateProduct;
    next();
  });
};
