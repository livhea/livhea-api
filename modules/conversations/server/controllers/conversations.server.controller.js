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

  //We expect either conversationId or userGroupId to be present
  var conversationId = req.query._id;
  var userGroupId = req.query.userGroupId;

  if(userGroupId){
    Message.find({ 'userGroupId': userGroupId }).sort('createdAt').exec(function(err, messages){
      if(err){
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        var User = mongoose.model('User');
        User.populate(messages, { path: 'fromUser' }, function(err, populated){
          res.json(populated);
          return;
        });
      }
    });
  } else if(conversationId){
    Message.find({ 'conversationId': conversationId }).sort('createdAt').exec(function(err, messages){
      if(err){
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        var User = mongoose.model('User');
        User.populate(messages, { path: 'fromUser' }, function(err, populated){
          res.json(populated);
        });
      }
    });
  } else {
    Message.aggregate([
      { $match: { $or: [ { toUser: req.user._id },{ fromUser: req.user._id } ], conversationId : { $ne: null } } },
      {
        $group: {
          _id: '$conversationId',
          messages: { $push : '$$ROOT' },
          fromUser: { '$first' : '$conversationId' },
          created: { '$last': '$createdAt' }
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
        User.populate(conversations, { path: 'fromUser' }, function(err, populated){
          if(err){
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.json(populated);
        });
      }

    });
  }

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
