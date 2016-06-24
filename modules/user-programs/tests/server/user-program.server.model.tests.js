'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserProgram = mongoose.model('UserProgram');

/**
 * Globals
 */
var user, userProgram;

/**
 * Unit tests
 */
describe('User program Model Unit Tests:', function() {
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
      userProgram = new UserProgram({
        name: 'User program Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return userProgram.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      userProgram.name = '';

      return userProgram.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    UserProgram.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
