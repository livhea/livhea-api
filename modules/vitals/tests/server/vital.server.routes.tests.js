'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vital = mongoose.model('Vital'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vital;

/**
 * Vital routes tests
 */
describe('Vital CRUD tests', function () {

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

    // Save a user to the test db and create new Vital
    user.save(function () {
      vital = {
        name: 'Vital name'
      };

      done();
    });
  });

  it('should be able to save a Vital if logged in', function (done) {
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

        // Save a new Vital
        agent.post('/api/vitals')
          .send(vital)
          .expect(200)
          .end(function (vitalSaveErr, vitalSaveRes) {
            // Handle Vital save error
            if (vitalSaveErr) {
              return done(vitalSaveErr);
            }

            // Get a list of Vitals
            agent.get('/api/vitals')
              .end(function (vitalsGetErr, vitalsGetRes) {
                // Handle Vital save error
                if (vitalsGetErr) {
                  return done(vitalsGetErr);
                }

                // Get Vitals list
                var vitals = vitalsGetRes.body;

                // Set assertions
                (vitals[0].user._id).should.equal(userId);
                (vitals[0].name).should.match('Vital name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Vital if not logged in', function (done) {
    agent.post('/api/vitals')
      .send(vital)
      .expect(403)
      .end(function (vitalSaveErr, vitalSaveRes) {
        // Call the assertion callback
        done(vitalSaveErr);
      });
  });

  it('should not be able to save an Vital if no name is provided', function (done) {
    // Invalidate name field
    vital.name = '';

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

        // Save a new Vital
        agent.post('/api/vitals')
          .send(vital)
          .expect(400)
          .end(function (vitalSaveErr, vitalSaveRes) {
            // Set message assertion
            (vitalSaveRes.body.message).should.match('Please fill Vital name');

            // Handle Vital save error
            done(vitalSaveErr);
          });
      });
  });

  it('should be able to update an Vital if signed in', function (done) {
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

        // Save a new Vital
        agent.post('/api/vitals')
          .send(vital)
          .expect(200)
          .end(function (vitalSaveErr, vitalSaveRes) {
            // Handle Vital save error
            if (vitalSaveErr) {
              return done(vitalSaveErr);
            }

            // Update Vital name
            vital.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Vital
            agent.put('/api/vitals/' + vitalSaveRes.body._id)
              .send(vital)
              .expect(200)
              .end(function (vitalUpdateErr, vitalUpdateRes) {
                // Handle Vital update error
                if (vitalUpdateErr) {
                  return done(vitalUpdateErr);
                }

                // Set assertions
                (vitalUpdateRes.body._id).should.equal(vitalSaveRes.body._id);
                (vitalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Vitals if not signed in', function (done) {
    // Create new Vital model instance
    var vitalObj = new Vital(vital);

    // Save the vital
    vitalObj.save(function () {
      // Request Vitals
      request(app).get('/api/vitals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Vital if not signed in', function (done) {
    // Create new Vital model instance
    var vitalObj = new Vital(vital);

    // Save the Vital
    vitalObj.save(function () {
      request(app).get('/api/vitals/' + vitalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', vital.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Vital with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vitals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vital is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Vital which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Vital
    request(app).get('/api/vitals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Vital with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Vital if signed in', function (done) {
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

        // Save a new Vital
        agent.post('/api/vitals')
          .send(vital)
          .expect(200)
          .end(function (vitalSaveErr, vitalSaveRes) {
            // Handle Vital save error
            if (vitalSaveErr) {
              return done(vitalSaveErr);
            }

            // Delete an existing Vital
            agent.delete('/api/vitals/' + vitalSaveRes.body._id)
              .send(vital)
              .expect(200)
              .end(function (vitalDeleteErr, vitalDeleteRes) {
                // Handle vital error error
                if (vitalDeleteErr) {
                  return done(vitalDeleteErr);
                }

                // Set assertions
                (vitalDeleteRes.body._id).should.equal(vitalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Vital if not signed in', function (done) {
    // Set Vital user
    vital.user = user;

    // Create new Vital model instance
    var vitalObj = new Vital(vital);

    // Save the Vital
    vitalObj.save(function () {
      // Try deleting Vital
      request(app).delete('/api/vitals/' + vitalObj._id)
        .expect(403)
        .end(function (vitalDeleteErr, vitalDeleteRes) {
          // Set message assertion
          (vitalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Vital error error
          done(vitalDeleteErr);
        });

    });
  });

  it('should be able to get a single Vital that has an orphaned user reference', function (done) {
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

          // Save a new Vital
          agent.post('/api/vitals')
            .send(vital)
            .expect(200)
            .end(function (vitalSaveErr, vitalSaveRes) {
              // Handle Vital save error
              if (vitalSaveErr) {
                return done(vitalSaveErr);
              }

              // Set assertions on new Vital
              (vitalSaveRes.body.name).should.equal(vital.name);
              should.exist(vitalSaveRes.body.user);
              should.equal(vitalSaveRes.body.user._id, orphanId);

              // force the Vital to have an orphaned user reference
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

                    // Get the Vital
                    agent.get('/api/vitals/' + vitalSaveRes.body._id)
                      .expect(200)
                      .end(function (vitalInfoErr, vitalInfoRes) {
                        // Handle Vital error
                        if (vitalInfoErr) {
                          return done(vitalInfoErr);
                        }

                        // Set assertions
                        (vitalInfoRes.body._id).should.equal(vitalSaveRes.body._id);
                        (vitalInfoRes.body.name).should.equal(vital.name);
                        should.equal(vitalInfoRes.body.user, undefined);

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
      Vital.remove().exec(done);
    });
  });
});
