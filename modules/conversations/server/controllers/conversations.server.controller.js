'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
Message = mongoose.model('Message'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
* Show the current conversation
*/
exports.read = function (req, res) {
  res.json(req.conversation);
};


/**
* List of conversations
*/
exports.list = function (req, res) {

  var conversationId = req.query.conversationId;

  //TODO:Check if conversationId is recieved in query
  //If yes, then return the list of messages for that conversation
  //Else return the grouped list of conversations
  //Ideally, the grouped list is only meant for 'coach' or 'admin' user
  //For a normal 'user' it should only fetch a given conversation

  Message.aggregate([
    { $match: { $or: [ { toUser: req.user._id },{ fromUser: req.user._id } ] } },
    {
      $group: {
        _id: '$conversationId',
        messages: { $push : "$$ROOT" },
        fromUser: {"$first": "$fromUser"},
        created: {"$last": "$created"}
      }
    },
    { $sort: { '_id.created': -1 } }
  ]).exec(function(err, conversations){
    if(err){
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      var User = mongoose.model('User');
      User.populate(conversations, {path: 'fromUser'}, function(err, populated){
        res.json(populated);
      });
    }

  });

};

/**
* conversation middleware
*/
exports.conversationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'conversation is invalid'
    });
  }

  Message.findOne({ conversationId: id }).populate('fromUser').exec(function (err, conversation) {
    if (err) {
      return next(err);
    } else if (!conversation) {
      return res.status(404).send({
        message: 'No conversation with that identifier has been found'
      });
    }
    req.conversation = conversation;
    next();
  });
};
