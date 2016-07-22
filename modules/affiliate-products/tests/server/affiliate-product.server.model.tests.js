'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  AffiliateProduct = mongoose.model('AffiliateProduct');

/**
 * Globals
 */
var user, affiliateProduct;

/**
 * Unit tests
 */
describe('Affiliate product Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      affiliateProduct = new AffiliateProduct({
        name: 'Affiliate product Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return affiliateProduct.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      affiliateProduct.name = '';

      return affiliateProduct.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    AffiliateProduct.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
