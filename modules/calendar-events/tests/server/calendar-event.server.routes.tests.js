'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CalendarEvent = mongoose.model('CalendarEvent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, calendarEvent;

/**
 * Calendar event routes tests
 */
describe('Calendar event CRUD tests', function () {

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

    // Save a user to the test db and create new Calendar event
    user.save(function () {
      calendarEvent = {
        name: 'Calendar event name'
      };

      done();
    });
  });

  it('should be able to save a Calendar event if logged in', function (done) {
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

        // Save a new Calendar event
        agent.post('/api/calendarEvents')
          .send(calendarEvent)
          .expect(200)
          .end(function (calendarEventSaveErr, calendarEventSaveRes) {
            // Handle Calendar event save error
            if (calendarEventSaveErr) {
              return done(calendarEventSaveErr);
            }

            // Get a list of Calendar events
            agent.get('/api/calendarEvents')
              .end(function (calendarEventsGetErr, calendarEventsGetRes) {
                // Handle Calendar event save error
                if (calendarEventsGetErr) {
                  return done(calendarEventsGetErr);
                }

                // Get Calendar events list
                var calendarEvents = calendarEventsGetRes.body;

                // Set assertions
                (calendarEvents[0].user._id).should.equal(userId);
                (calendarEvents[0].name).should.match('Calendar event name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Calendar event if not logged in', function (done) {
    agent.post('/api/calendarEvents')
      .send(calendarEvent)
      .expect(403)
      .end(function (calendarEventSaveErr, calendarEventSaveRes) {
        // Call the assertion callback
        done(calendarEventSaveErr);
      });
  });

  it('should not be able to save an Calendar event if no name is provided', function (done) {
    // Invalidate name field
    calendarEvent.name = '';

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

        // Save a new Calendar event
        agent.post('/api/calendarEvents')
          .send(calendarEvent)
          .expect(400)
          .end(function (calendarEventSaveErr, calendarEventSaveRes) {
            // Set message assertion
            (calendarEventSaveRes.body.message).should.match('Please fill Calendar event name');

            // Handle Calendar event save error
            done(calendarEventSaveErr);
          });
      });
  });

  it('should be able to update an Calendar event if signed in', function (done) {
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

        // Save a new Calendar event
        agent.post('/api/calendarEvents')
          .send(calendarEvent)
          .expect(200)
          .end(function (calendarEventSaveErr, calendarEventSaveRes) {
            // Handle Calendar event save error
            if (calendarEventSaveErr) {
              return done(calendarEventSaveErr);
            }

            // Update Calendar event name
            calendarEvent.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Calendar event
            agent.put('/api/calendarEvents/' + calendarEventSaveRes.body._id)
              .send(calendarEvent)
              .expect(200)
              .end(function (calendarEventUpdateErr, calendarEventUpdateRes) {
                // Handle Calendar event update error
                if (calendarEventUpdateErr) {
                  return done(calendarEventUpdateErr);
                }

                // Set assertions
                (calendarEventUpdateRes.body._id).should.equal(calendarEventSaveRes.body._id);
                (calendarEventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Calendar events if not signed in', function (done) {
    // Create new Calendar event model instance
    var calendarEventObj = new CalendarEvent(calendarEvent);

    // Save the calendarEvent
    calendarEventObj.save(function () {
      // Request Calendar events
      request(app).get('/api/calendarEvents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Calendar event if not signed in', function (done) {
    // Create new Calendar event model instance
    var calendarEventObj = new CalendarEvent(calendarEvent);

    // Save the Calendar event
    calendarEventObj.save(function () {
      request(app).get('/api/calendarEvents/' + calendarEventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', calendarEvent.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Calendar event with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/calendarEvents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Calendar event is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Calendar event which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Calendar event
    request(app).get('/api/calendarEvents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Calendar event with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Calendar event if signed in', function (done) {
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

        // Save a new Calendar event
        agent.post('/api/calendarEvents')
          .send(calendarEvent)
          .expect(200)
          .end(function (calendarEventSaveErr, calendarEventSaveRes) {
            // Handle Calendar event save error
            if (calendarEventSaveErr) {
              return done(calendarEventSaveErr);
            }

            // Delete an existing Calendar event
            agent.delete('/api/calendarEvents/' + calendarEventSaveRes.body._id)
              .send(calendarEvent)
              .expect(200)
              .end(function (calendarEventDeleteErr, calendarEventDeleteRes) {
                // Handle calendarEvent error error
                if (calendarEventDeleteErr) {
                  return done(calendarEventDeleteErr);
                }

                // Set assertions
                (calendarEventDeleteRes.body._id).should.equal(calendarEventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Calendar event if not signed in', function (done) {
    // Set Calendar event user
    calendarEvent.user = user;

    // Create new Calendar event model instance
    var calendarEventObj = new CalendarEvent(calendarEvent);

    // Save the Calendar event
    calendarEventObj.save(function () {
      // Try deleting Calendar event
      request(app).delete('/api/calendarEvents/' + calendarEventObj._id)
        .expect(403)
        .end(function (calendarEventDeleteErr, calendarEventDeleteRes) {
          // Set message assertion
          (calendarEventDeleteRes.body.message).should.match('User is not authorized');

          // Handle Calendar event error error
          done(calendarEventDeleteErr);
        });

    });
  });

  it('should be able to get a single Calendar event that has an orphaned user reference', function (done) {
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

          // Save a new Calendar event
          agent.post('/api/calendarEvents')
            .send(calendarEvent)
            .expect(200)
            .end(function (calendarEventSaveErr, calendarEventSaveRes) {
              // Handle Calendar event save error
              if (calendarEventSaveErr) {
                return done(calendarEventSaveErr);
              }

              // Set assertions on new Calendar event
              (calendarEventSaveRes.body.name).should.equal(calendarEvent.name);
              should.exist(calendarEventSaveRes.body.user);
              should.equal(calendarEventSaveRes.body.user._id, orphanId);

              // force the Calendar event to have an orphaned user reference
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

                    // Get the Calendar event
                    agent.get('/api/calendarEvents/' + calendarEventSaveRes.body._id)
                      .expect(200)
                      .end(function (calendarEventInfoErr, calendarEventInfoRes) {
                        // Handle Calendar event error
                        if (calendarEventInfoErr) {
                          return done(calendarEventInfoErr);
                        }

                        // Set assertions
                        (calendarEventInfoRes.body._id).should.equal(calendarEventSaveRes.body._id);
                        (calendarEventInfoRes.body.name).should.equal(calendarEvent.name);
                        should.equal(calendarEventInfoRes.body.user, undefined);

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
      CalendarEvent.remove().exec(done);
    });
  });
});
