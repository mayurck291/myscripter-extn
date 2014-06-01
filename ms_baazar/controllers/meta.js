// Generated by CoffeeScript 1.3.3
(function() {
  var Meta, Recipe, async, logger;

  Meta = require('../models/meta');

  Recipe = require('../models/recipe');

  logger = require('../utils/logger');

  async = require('async');

  exports.favourite = function(request, response) {
    var params, query, update, user, _id;
    params = request.body;
    _id = params._id;
    user = params.user;
    logger.info("" + user + " Favorited recipe " + _id);
    query = {
      _id: _id,
      favs: user
    };
    update = {
      "$addToSet": {
        favs: user
      }
    };
    return Meta.where({
      _id: _id
    }).where('favs').ne(user).update(update, function(e, r) {
      if (e != null) {
        return response.json(500, {});
      } else {
        return response.json(200, {});
      }
    });
  };

  exports.unfavourite = function(request, response) {
    var params, query, updates, user, _id;
    params = request.body;
    _id = params._id;
    user = params.user;
    logger.info("" + user + " UnFavorited recipe " + _id);
    query = {
      _id: _id,
      favs: user
    };
    updates = {
      "$pull": {
        favs: user
      }
    };
    return Meta.where({
      _id: _id
    }).update(updates, function(e, r) {
      if (e != null) {
        return response.json(500, {});
      } else {
        return response.json(200, {});
      }
    });
  };

  exports.get = function(request, response) {
    var finalJson, userFilter;
    logger.info("Getting all meta info of all the recipes");
    userFilter = '-authToken -updatedAt';
    finalJson = [];
    return Meta.find({}).populate('_id', '-ingredients').populate('users', userFilter).populate('favs', userFilter).populate('karma.user', userFilter).sort().exec(function(error, recipes) {
      var options;
      if (error) {
        return res.json(500);
      } else {
        options = {
          path: "_id.author _id.comments.user",
          model: "user",
          select: userFilter
        };
        return Recipe.populate(recipes, options, function(error, recipes) {
          logger.info("sending recip");
          return response.json(recipes, 200);
        });
      }
    });
  };

  exports.karma = function(request, response) {
    var addNewEntry, body, karma, params, query, user, _id;
    logger.info("[ karma ] START");
    params = request.body;
    _id = params._id;
    user = params.user;
    karma = params.karma;
    body = params.body;
    logger.info("[ karma ] " + user + " -> " + karma + " -> " + _id);
    addNewEntry = function() {
      var query, updates;
      logger.info("[ addNewEntry ] START adding new entry for " + user + " -> " + karma + " -> " + body + " -> " + _id);
      updates = {
        '$addToSet': {
          karma: {
            user: user,
            karma: karma,
            body: body
          }
        }
      };
      query = {
        _id: _id
      };
      return Meta.update({
        _id: _id
      }, updates, function(error, noOfDocsUpdated) {
        logger.info("[ addNewEntry ] END " + user + " gave " + karma + " to recipe " + _id + " , " + error + ", updated " + noOfDocsUpdated + " docs");
        return response.json({}, 200);
      });
    };
    query = {
      _id: _id,
      'karma.user': user
    };
    Meta.findOne(query, function(error, doc) {
      var entry, i, _i, _len, _ref;
      logger.info("[ karma ] checking if entry exists for " + user + " -> " + karma + " -> " + _id);
      if (error != null) {
        logger.info("[ karma ] END error occurred try later");
        response.json({
          response: "error",
          msg: "Error occurred...try later...:("
        }, 500);
      } else if (doc != null) {
        logger.info("[ karma ] exists !! updating karma for " + _id + " by " + user + " to " + karma);
        _ref = doc.karma;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          entry = _ref[i];
          if (doc.karma[i].user === user) {
            doc.karma[i].karma = karma;
            doc.karma[i].body = body;
            doc.save(function(error, updatedDoc) {
              if (error != null) {
                logger.info("[ karma ] END try again later....");
                return response.json({
                  response: "error",
                  msg: "try again after some time...:("
                }, 500);
              } else {
                logger.info("[ karma ] END " + user + " updated " + _id + "'s karma to " + karma);
                return response.json(updatedDoc, 200);
              }
            });
          }
        }
      } else {
        logger.info("[ karma ] END doesn't exist calling [ addNewEntry ]");
        addNewEntry();
      }
    });
  };

}).call(this);
