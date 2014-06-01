// Generated by CoffeeScript 1.3.3
(function() {
  var Baazar, BaazarModule,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Baazar = (function() {

    function Baazar($q, $http) {
      this.$q = $q;
      this.$http = $http;
      this.updateUser = __bind(this.updateUser, this);

      this.domain = "http://localhost:3000";
      /* USER RELATED METHODS
      */

      this.updateUserUrl = "" + this.domain + "/updateUser";
      /* GET CALLS
      */

      this.getUrl = "" + this.domain + "/get";
      this.listUrl = "" + this.domain + "/list";
      this.popularUrl = "" + this.domain + "/popular";
      this.trendingUrl = "" + this.domain + "/trending";
      this.myRecipesUrl = "" + this.domain + "/myRecipes";
      this.myFavRecipesUrl = "" + this.domain + "/myFavourite";
      this.topTenWeekUrl = "" + this.domain + "/topTenWeek";
      this.newestRecipesUrl = "" + this.domain + "/newestRecipes";
      this.getRecipeUrl = "" + this.domain + "/getRecipe";
      /* POST CALLS
      */

      this.postRecipeUrl = "" + this.domain + "/postRecipe";
      this.favRecipeUrl = "" + this.domain + "/favourite";
      this.unFavRecipeUrl = "" + this.domain + "/unfavourite";
      this.postCommentUrl = "" + this.domain + "/comment";
      this.giveKarmaToRecipeUrl = "" + this.domain + "/karma";
      this.incUsersRecipesUrl = "" + this.domain + "/incUsersRecipes";
      this.forkedUrl = "" + this.domain + "/forked";
    }

    Baazar.prototype.handleGetCall = function(defer, response) {
      if (response.status === "success") {
        defer.resolve(response.data);
      } else {
        defer.reject(response.msg);
      }
    };

    Baazar.prototype.handlePostCall = function(defer, response) {
      if (response.response === "success") {
        defer.resolve(response.msg);
      } else {
        defer.reject(response.msg);
      }
    };

    Baazar.prototype.get = function() {
      var defer,
        _this = this;
      defer = this.$q.defer();
      this.$http.get(this.getUrl).success(function(response, status) {
        defer.resolve(response);
      }).error(function(response, status) {
        defer.reject(response);
      });
      return defer.promise;
    };

    Baazar.prototype.updateUser = function(user) {
      console.log(user);
      this.$http.post(this.updateUserUrl, user);
    };

    Baazar.prototype.getRecipe = function(id) {
      var defer, url,
        _this = this;
      defer = this.$q.defer();
      url = "" + this.getRecipeUrl + "/" + id;
      this.$http.get(url).success(function(response, status) {
        defer.resolve(response);
      });
      return defer.promise;
    };

    Baazar.prototype.topTenWeek = function() {
      var defer,
        _this = this;
      defer = this.$q.defer();
      this.$http.get(this.topTenWeekUrl).success(function(response, status) {
        _this.handleGetCall(defer, response);
      }).error(function(response, status) {
        _this.handleGetCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.newestRecipes = function() {
      var defer,
        _this = this;
      defer = this.$q.defer();
      this.$http.get(this.newestRecipesUrl).success(function(response, status) {
        _this.handleGetCall(defer, response);
      }).error(function(response, status) {
        _this.handleGetCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.popular = function() {
      var defer,
        _this = this;
      defer = this.$q.defer();
      this.$http.get(this.popularUrl).success(function(response, status) {
        _this.handleGetCall(defer, response);
      }).error(function(response, status) {
        _this.handleGetCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.list = function(pageno) {
      var defer, url,
        _this = this;
      pageno = pageno != null ? pageno : 0;
      url = "" + this.listUrl + "/" + pageno;
      console.log(url, this.listUrl);
      defer = this.$q.defer();
      this.$http.get(url).success(function(response, status) {
        defer.resolve(response);
      }).error(function(response, status) {
        defer.reject(response);
      });
      return defer.promise;
    };

    Baazar.prototype.myRecipes = function(userID) {
      var defer, url,
        _this = this;
      defer = this.$q.defer();
      url = "" + this.myRecipesUrl + "/" + userID;
      this.$http.get(url).success(function(response, status) {
        _this.handleGetCall(defer, response);
      }).error(function(response, status) {
        _this.handleGetCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.myFavourite = function(userID) {
      var defer, url,
        _this = this;
      defer = this.$q.defer();
      url = "" + this.myFavRecipesUrl + "/" + userID;
      this.$http.get(url).success(function(response, status) {
        _this.handleGetCall(defer, response);
      }).error(function(response, status) {
        _this.handleGetCall(defer, response);
      });
      return defer.promise;
    };

    /* POST SERVICESE CALLS
    */


    Baazar.prototype.postRecipe = function(recipe) {
      var defer,
        _this = this;
      defer = this.$q.defer();
      this.$http.post(this.postRecipeUrl, recipe).success(function(response, status) {
        _this.handlePostCall(defer, response);
      }).error(function(response, status) {
        _this.handlePostCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.postComment = function(recipeID, user, comment) {
      var defer, payload,
        _this = this;
      defer = this.$q.defer();
      payload = {
        _id: recipeID,
        user: user,
        body: comment
      };
      this.$http.post(this.postCommentUrl, payload).success(function(response, status) {
        defer.resolve();
      }).error(function(response, status) {
        defer.reject();
      });
      return defer.promise;
    };

    Baazar.prototype.giveKarmaToRecipe = function(user, recipeID, karma, body) {
      var defer, payload,
        _this = this;
      defer = this.$q.defer();
      payload = {
        _id: recipeID,
        user: user,
        karma: karma,
        body: body
      };
      this.$http.post(this.giveKarmaToRecipeUrl, payload).success(function(response, status) {
        defer.resolve();
      }).error(function(response, status) {
        defer.reject();
      });
      return defer.promise;
    };

    Baazar.prototype.incUsersRecipes = function(recipeID) {
      var defer, url,
        _this = this;
      defer = this.$q.defer();
      url = "" + this.incUsersRecipesUrl + "/" + recipeID;
      this.$http.post(url, karma).success(function(response, status) {
        _this.handlePostCall(defer, response);
      }).error(function(response, status) {
        _this.handlePostCall(defer, response);
      });
      return defer.promise;
    };

    Baazar.prototype.favourite = function(user, recipeID) {
      var defer, payload;
      defer = this.$q.defer();
      payload = {
        user: user,
        _id: recipeID
      };
      this.$http.post(this.favRecipeUrl, payload).success(defer.resolve).error(defer.reject);
      return defer.promise;
    };

    Baazar.prototype.unfavourite = function(user, recipeID) {
      var defer, payload;
      defer = this.$q.defer();
      payload = {
        user: user,
        _id: recipeID
      };
      this.$http.post(this.unFavRecipeUrl, payload).success(defer.resolve).error(defer.reject);
      return defer.promise;
    };

    Baazar.prototype.forked = function(recipeID) {
      var defer, payload;
      defer = this.$q.defer();
      payload = {
        _id: recipeID
      };
      this.$http.post(this.forkedUrl, payload).success(defer.resolve).error(defer.reject);
      return defer.promise;
    };

    return Baazar;

  })();

  BaazarModule = angular.module("BaazarModule", []);

  BaazarModule.service('Baazar', ['$q', '$http', Baazar]);

}).call(this);
