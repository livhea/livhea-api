'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  AffiliateProduct = mongoose.model('AffiliateProduct'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, affiliateProduct;

/**
 * Affiliate product routes tests
 */
describe('Affiliate product CRUD tests', function () {

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

    // Save a user to the test db and create new Affiliate product
    user.save(function () {
      affiliateProduct = {
        name: 'Affiliate product name'
      };

      done();
    });
  });

  it('should be able to save a Affiliate product if logged in', function (done) {
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

        // Save a new Affiliate product
        agent.post('/api/affiliateProducts')
          .send(affiliateProduct)
          .expect(200)
          .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
            // Handle Affiliate product save error
            if (affiliateProductSaveErr) {
              return done(affiliateProductSaveErr);
            }

            // Get a list of Affiliate products
            agent.get('/api/affiliateProducts')
              .end(function (affiliateProductsGetErr, affiliateProductsGetRes) {
                // Handle Affiliate product save error
                if (affiliateProductsGetErr) {
                  return done(affiliateProductsGetErr);
                }

                // Get Affiliate products list
                var affiliateProducts = affiliateProductsGetRes.body;

                // Set assertions
                (affiliateProducts[0].user._id).should.equal(userId);
                (affiliateProducts[0].name).should.match('Affiliate product name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Affiliate product if not logged in', function (done) {
    agent.post('/api/affiliateProducts')
      .send(affiliateProduct)
      .expect(403)
      .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
        // Call the assertion callback
        done(affiliateProductSaveErr);
      });
  });

  it('should not be able to save an Affiliate product if no name is provided', function (done) {
    // Invalidate name field
    affiliateProduct.name = '';

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

        // Save a new Affiliate product
        agent.post('/api/affiliateProducts')
          .send(affiliateProduct)
          .expect(400)
          .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
            // Set message assertion
            (affiliateProductSaveRes.body.message).should.match('Please fill Affiliate product name');

            // Handle Affiliate product save error
            done(affiliateProductSaveErr);
          });
      });
  });

  it('should be able to update an Affiliate product if signed in', function (done) {
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

        // Save a new Affiliate product
        agent.post('/api/affiliateProducts')
          .send(affiliateProduct)
          .expect(200)
          .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
            // Handle Affiliate product save error
            if (affiliateProductSaveErr) {
              return done(affiliateProductSaveErr);
            }

            // Update Affiliate product name
            affiliateProduct.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Affiliate product
            agent.put('/api/affiliateProducts/' + affiliateProductSaveRes.body._id)
              .send(affiliateProduct)
              .expect(200)
              .end(function (affiliateProductUpdateErr, affiliateProductUpdateRes) {
                // Handle Affiliate product update error
                if (affiliateProductUpdateErr) {
                  return done(affiliateProductUpdateErr);
                }

                // Set assertions
                (affiliateProductUpdateRes.body._id).should.equal(affiliateProductSaveRes.body._id);
                (affiliateProductUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Affiliate products if not signed in', function (done) {
    // Create new Affiliate product model instance
    var affiliateProductObj = new AffiliateProduct(affiliateProduct);

    // Save the affiliateProduct
    affiliateProductObj.save(function () {
      // Request Affiliate products
      request(app).get('/api/affiliateProducts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Affiliate product if not signed in', function (done) {
    // Create new Affiliate product model instance
    var affiliateProductObj = new AffiliateProduct(affiliateProduct);

    // Save the Affiliate product
    affiliateProductObj.save(function () {
      request(app).get('/api/affiliateProducts/' + affiliateProductObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', affiliateProduct.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Affiliate product with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/affiliateProducts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Affiliate product is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Affiliate product which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Affiliate product
    request(app).get('/api/affiliateProducts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Affiliate product with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Affiliate product if signed in', function (done) {
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

        // Save a new Affiliate product
        agent.post('/api/affiliateProducts')
          .send(affiliateProduct)
          .expect(200)
          .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
            // Handle Affiliate product save error
            if (affiliateProductSaveErr) {
              return done(affiliateProductSaveErr);
            }

            // Delete an existing Affiliate product
            agent.delete('/api/affiliateProducts/' + affiliateProductSaveRes.body._id)
              .send(affiliateProduct)
              .expect(200)
              .end(function (affiliateProductDeleteErr, affiliateProductDeleteRes) {
                // Handle affiliateProduct error error
                if (affiliateProductDeleteErr) {
                  return done(affiliateProductDeleteErr);
                }

                // Set assertions
                (affiliateProductDeleteRes.body._id).should.equal(affiliateProductSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Affiliate product if not signed in', function (done) {
    // Set Affiliate product user
    affiliateProduct.user = user;

    // Create new Affiliate product model instance
    var affiliateProductObj = new AffiliateProduct(affiliateProduct);

    // Save the Affiliate product
    affiliateProductObj.save(function () {
      // Try deleting Affiliate product
      request(app).delete('/api/affiliateProducts/' + affiliateProductObj._id)
        .expect(403)
        .end(function (affiliateProductDeleteErr, affiliateProductDeleteRes) {
          // Set message assertion
          (affiliateProductDeleteRes.body.message).should.match('User is not authorized');

          // Handle Affiliate product error error
          done(affiliateProductDeleteErr);
        });

    });
  });

  it('should be able to get a single Affiliate product that has an orphaned user reference', function (done) {
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

          // Save a new Affiliate product
          agent.post('/api/affiliateProducts')
            .send(affiliateProduct)
            .expect(200)
            .end(function (affiliateProductSaveErr, affiliateProductSaveRes) {
              // Handle Affiliate product save error
              if (affiliateProductSaveErr) {
                return done(affiliateProductSaveErr);
              }

              // Set assertions on new Affiliate product
              (affiliateProductSaveRes.body.name).should.equal(affiliateProduct.name);
              should.exist(affiliateProductSaveRes.body.user);
              should.equal(affiliateProductSaveRes.body.user._id, orphanId);

              // force the Affiliate product to have an orphaned user reference
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

                    // Get the Affiliate product
                    agent.get('/api/affiliateProducts/' + affiliateProductSaveRes.body._id)
                      .expect(200)
                      .end(function (affiliateProductInfoErr, affiliateProductInfoRes) {
                        // Handle Affiliate product error
                        if (affiliateProductInfoErr) {
                          return done(affiliateProductInfoErr);
                        }

                        // Set assertions
                        (affiliateProductInfoRes.body._id).should.equal(affiliateProductSaveRes.body._id);
                        (affiliateProductInfoRes.body.name).should.equal(affiliateProduct.name);
                        should.equal(affiliateProductInfoRes.body.user, undefined);

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
      AffiliateProduct.remove().exec(done);
    });
  });
});
