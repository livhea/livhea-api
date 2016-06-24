'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserProgram = mongoose.model('UserProgram'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, userProgram;

/**
 * User program routes tests
 */
describe('User program CRUD tests', function () {

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

    // Save a user to the test db and create new User program
    user.save(function () {
      userProgram = {
        name: 'User program name'
      };

      done();
    });
  });

  it('should be able to save a User program if logged in', function (done) {
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

        // Save a new User program
        agent.post('/api/userPrograms')
          .send(userProgram)
          .expect(200)
          .end(function (userProgramSaveErr, userProgramSaveRes) {
            // Handle User program save error
            if (userProgramSaveErr) {
              return done(userProgramSaveErr);
            }

            // Get a list of User programs
            agent.get('/api/userPrograms')
              .end(function (userProgramsGetErr, userProgramsGetRes) {
                // Handle User program save error
                if (userProgramsGetErr) {
                  return done(userProgramsGetErr);
                }

                // Get User programs list
                var userPrograms = userProgramsGetRes.body;

                // Set assertions
                (userPrograms[0].user._id).should.equal(userId);
                (userPrograms[0].name).should.match('User program name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an User program if not logged in', function (done) {
    agent.post('/api/userPrograms')
      .send(userProgram)
      .expect(403)
      .end(function (userProgramSaveErr, userProgramSaveRes) {
        // Call the assertion callback
        done(userProgramSaveErr);
      });
  });

  it('should not be able to save an User program if no name is provided', function (done) {
    // Invalidate name field
    userProgram.name = '';

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

        // Save a new User program
        agent.post('/api/userPrograms')
          .send(userProgram)
          .expect(400)
          .end(function (userProgramSaveErr, userProgramSaveRes) {
            // Set message assertion
            (userProgramSaveRes.body.message).should.match('Please fill User program name');

            // Handle User program save error
            done(userProgramSaveErr);
          });
      });
  });

  it('should be able to update an User program if signed in', function (done) {
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

        // Save a new User program
        agent.post('/api/userPrograms')
          .send(userProgram)
          .expect(200)
          .end(function (userProgramSaveErr, userProgramSaveRes) {
            // Handle User program save error
            if (userProgramSaveErr) {
              return done(userProgramSaveErr);
            }

            // Update User program name
            userProgram.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing User program
            agent.put('/api/userPrograms/' + userProgramSaveRes.body._id)
              .send(userProgram)
              .expect(200)
              .end(function (userProgramUpdateErr, userProgramUpdateRes) {
                // Handle User program update error
                if (userProgramUpdateErr) {
                  return done(userProgramUpdateErr);
                }

                // Set assertions
                (userProgramUpdateRes.body._id).should.equal(userProgramSaveRes.body._id);
                (userProgramUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of User programs if not signed in', function (done) {
    // Create new User program model instance
    var userProgramObj = new UserProgram(userProgram);

    // Save the userProgram
    userProgramObj.save(function () {
      // Request User programs
      request(app).get('/api/userPrograms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single User program if not signed in', function (done) {
    // Create new User program model instance
    var userProgramObj = new UserProgram(userProgram);

    // Save the User program
    userProgramObj.save(function () {
      request(app).get('/api/userPrograms/' + userProgramObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userProgram.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single User program with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userPrograms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'User program is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single User program which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent User program
    request(app).get('/api/userPrograms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No User program with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an User program if signed in', function (done) {
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

        // Save a new User program
        agent.post('/api/userPrograms')
          .send(userProgram)
          .expect(200)
          .end(function (userProgramSaveErr, userProgramSaveRes) {
            // Handle User program save error
            if (userProgramSaveErr) {
              return done(userProgramSaveErr);
            }

            // Delete an existing User program
            agent.delete('/api/userPrograms/' + userProgramSaveRes.body._id)
              .send(userProgram)
              .expect(200)
              .end(function (userProgramDeleteErr, userProgramDeleteRes) {
                // Handle userProgram error error
                if (userProgramDeleteErr) {
                  return done(userProgramDeleteErr);
                }

                // Set assertions
                (userProgramDeleteRes.body._id).should.equal(userProgramSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an User program if not signed in', function (done) {
    // Set User program user
    userProgram.user = user;

    // Create new User program model instance
    var userProgramObj = new UserProgram(userProgram);

    // Save the User program
    userProgramObj.save(function () {
      // Try deleting User program
      request(app).delete('/api/userPrograms/' + userProgramObj._id)
        .expect(403)
        .end(function (userProgramDeleteErr, userProgramDeleteRes) {
          // Set message assertion
          (userProgramDeleteRes.body.message).should.match('User is not authorized');

          // Handle User program error error
          done(userProgramDeleteErr);
        });

    });
  });

  it('should be able to get a single User program that has an orphaned user reference', function (done) {
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

          // Save a new User program
          agent.post('/api/userPrograms')
            .send(userProgram)
            .expect(200)
            .end(function (userProgramSaveErr, userProgramSaveRes) {
              // Handle User program save error
              if (userProgramSaveErr) {
                return done(userProgramSaveErr);
              }

              // Set assertions on new User program
              (userProgramSaveRes.body.name).should.equal(userProgram.name);
              should.exist(userProgramSaveRes.body.user);
              should.equal(userProgramSaveRes.body.user._id, orphanId);

              // force the User program to have an orphaned user reference
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

                    // Get the User program
                    agent.get('/api/userPrograms/' + userProgramSaveRes.body._id)
                      .expect(200)
                      .end(function (userProgramInfoErr, userProgramInfoRes) {
                        // Handle User program error
                        if (userProgramInfoErr) {
                          return done(userProgramInfoErr);
                        }

                        // Set assertions
                        (userProgramInfoRes.body._id).should.equal(userProgramSaveRes.body._id);
                        (userProgramInfoRes.body.name).should.equal(userProgram.name);
                        should.equal(userProgramInfoRes.body.user, undefined);

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
      UserProgram.remove().exec(done);
    });
  });
});
