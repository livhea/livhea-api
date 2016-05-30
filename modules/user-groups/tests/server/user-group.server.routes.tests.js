'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserGroup = mongoose.model('UserGroup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, userGroup;

/**
 * User group routes tests
 */
describe('User group CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new User group
    user.save(function () {
      userGroup = {
        name: 'User group name'
      };

      done();
    });
  });

  it('should be able to save a User group if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new User group
        agent.post('/api/userGroups')
          .send(userGroup)
          .expect(200)
          .end(function (userGroupSaveErr, userGroupSaveRes) {
            // Handle User group save error
            if (userGroupSaveErr) {
              return done(userGroupSaveErr);
            }

            // Get a list of User groups
            agent.get('/api/userGroups')
              .end(function (userGroupsGetErr, userGroupsGetRes) {
                // Handle User group save error
                if (userGroupsGetErr) {
                  return done(userGroupsGetErr);
                }

                // Get User groups list
                var userGroups = userGroupsGetRes.body;

                // Set assertions
                (userGroups[0].user._id).should.equal(userId);
                (userGroups[0].name).should.match('User group name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an User group if not logged in', function (done) {
    agent.post('/api/userGroups')
      .send(userGroup)
      .expect(403)
      .end(function (userGroupSaveErr, userGroupSaveRes) {
        // Call the assertion callback
        done(userGroupSaveErr);
      });
  });

  it('should not be able to save an User group if no name is provided', function (done) {
    // Invalidate name field
    userGroup.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new User group
        agent.post('/api/userGroups')
          .send(userGroup)
          .expect(400)
          .end(function (userGroupSaveErr, userGroupSaveRes) {
            // Set message assertion
            (userGroupSaveRes.body.message).should.match('Please fill User group name');

            // Handle User group save error
            done(userGroupSaveErr);
          });
      });
  });

  it('should be able to update an User group if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new User group
        agent.post('/api/userGroups')
          .send(userGroup)
          .expect(200)
          .end(function (userGroupSaveErr, userGroupSaveRes) {
            // Handle User group save error
            if (userGroupSaveErr) {
              return done(userGroupSaveErr);
            }

            // Update User group name
            userGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing User group
            agent.put('/api/userGroups/' + userGroupSaveRes.body._id)
              .send(userGroup)
              .expect(200)
              .end(function (userGroupUpdateErr, userGroupUpdateRes) {
                // Handle User group update error
                if (userGroupUpdateErr) {
                  return done(userGroupUpdateErr);
                }

                // Set assertions
                (userGroupUpdateRes.body._id).should.equal(userGroupSaveRes.body._id);
                (userGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of User groups if not signed in', function (done) {
    // Create new User group model instance
    var userGroupObj = new UserGroup(userGroup);

    // Save the userGroup
    userGroupObj.save(function () {
      // Request User groups
      request(app).get('/api/userGroups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single User group if not signed in', function (done) {
    // Create new User group model instance
    var userGroupObj = new UserGroup(userGroup);

    // Save the User group
    userGroupObj.save(function () {
      request(app).get('/api/userGroups/' + userGroupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userGroup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single User group with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userGroups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'User group is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single User group which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent User group
    request(app).get('/api/userGroups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No User group with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an User group if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new User group
        agent.post('/api/userGroups')
          .send(userGroup)
          .expect(200)
          .end(function (userGroupSaveErr, userGroupSaveRes) {
            // Handle User group save error
            if (userGroupSaveErr) {
              return done(userGroupSaveErr);
            }

            // Delete an existing User group
            agent.delete('/api/userGroups/' + userGroupSaveRes.body._id)
              .send(userGroup)
              .expect(200)
              .end(function (userGroupDeleteErr, userGroupDeleteRes) {
                // Handle userGroup error error
                if (userGroupDeleteErr) {
                  return done(userGroupDeleteErr);
                }

                // Set assertions
                (userGroupDeleteRes.body._id).should.equal(userGroupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an User group if not signed in', function (done) {
    // Set User group user
    userGroup.user = user;

    // Create new User group model instance
    var userGroupObj = new UserGroup(userGroup);

    // Save the User group
    userGroupObj.save(function () {
      // Try deleting User group
      request(app).delete('/api/userGroups/' + userGroupObj._id)
        .expect(403)
        .end(function (userGroupDeleteErr, userGroupDeleteRes) {
          // Set message assertion
          (userGroupDeleteRes.body.message).should.match('User is not authorized');

          // Handle User group error error
          done(userGroupDeleteErr);
        });

    });
  });

  it('should be able to get a single User group that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new User group
          agent.post('/api/userGroups')
            .send(userGroup)
            .expect(200)
            .end(function (userGroupSaveErr, userGroupSaveRes) {
              // Handle User group save error
              if (userGroupSaveErr) {
                return done(userGroupSaveErr);
              }

              // Set assertions on new User group
              (userGroupSaveRes.body.name).should.equal(userGroup.name);
              should.exist(userGroupSaveRes.body.user);
              should.equal(userGroupSaveRes.body.user._id, orphanId);

              // force the User group to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the User group
                    agent.get('/api/userGroups/' + userGroupSaveRes.body._id)
                      .expect(200)
                      .end(function (userGroupInfoErr, userGroupInfoRes) {
                        // Handle User group error
                        if (userGroupInfoErr) {
                          return done(userGroupInfoErr);
                        }

                        // Set assertions
                        (userGroupInfoRes.body._id).should.equal(userGroupSaveRes.body._id);
                        (userGroupInfoRes.body.name).should.equal(userGroup.name);
                        should.equal(userGroupInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      UserGroup.remove().exec(done);
    });
  });
});
