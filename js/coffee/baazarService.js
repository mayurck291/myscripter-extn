// Generated by CoffeeScript 1.7.1
var Baazar;

Baazar = (function () {
	function Baazar($q, $http) {
		var domain, favRecipeUrl, giveKarmaToRecipeUrl, listUrl, myFavRecipesUrl, myRecipesUrl, newestRecipesUrl, popularUrl, postCommentUrl, postRecipeUrl, topTenWeekUrl, trendingUrl;
		this.$q = $q;
		this.$http = $http;
		domain = "http://localhost:3000";

		/* GET CALLS */
		listUrl = "" + domain + "/list";
		popularUrl = "" + domain + "/popular";
		trendingUrl = "" + domain + "/trending";
		myRecipesUrl = "" + domain + "/myRecipes";
		myFavRecipesUrl = "" + domain + "/myFavRecipes";
		topTenWeekUrl = "" + domain + "/topTenWeek";
		newestRecipesUrl = "" + domain + "/newestRecipes";

		/* POST CALLS */
		postRecipeUrl = "" + domain + "/postRecipe";
		favRecipeUrl = "" + domain + "/favRecipe";
		postCommentUrl = "" + domain + "/postComment";
		giveKarmaToRecipeUrl = "" + domain + "/giveKarmaToRecipeUrl";
	}

	Baazar.prototype.handleGetCall = function (defer, response) {
		if (response.status === "success") {
			defer.resolve(response.data);
		} else {
			defer.reject(response.msg);
		}
	};

	Baazar.prototype.handlePostCall = function (defer, response) {
		if (response.status === "success") {
			defer.resolve(response.msg);
		} else {
			defer.reject(response.msg);
		}
	};

	Baazar.prototype.trending = function () {
		var defer;
		defer = this.$q.defer();
		this.$http.get(this.trendingUrl)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.topTenWeek = function () {
		var defer;
		defer = this.$q.defer();
		this.$http.get(this.topTenWeekUrl)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.newestRecipes = function () {
		var defer;
		defer = this.$q.defer();
		this.$http.get(this.newestRecipesUrl)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.popular = function () {
		var defer;
		defer = this.$q.defer();
		this.$http.get(this.popularUrl)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.list = function (pageno) {
		var defer, url;
		pageno = pageno != null ? pageno : 0;
		url = "" + this.listUrl + "/" + pageno;
		defer = this.$q.defer();
		this.$http.get(url)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.myRecipes = function (userID) {
		var defer, url;
		defer = this.$q.defer();
		url = "" + this.myRecipesUrl + "/" + userID;
		this.$http.get(url)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.myFavRecipes = function (userID) {
		var defer, url;
		defer = this.$q.defer();
		url = "" + this.myFavRecipesUrl + "/" + userID;
		this.$http.get(url)
			.success((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handleGetCall(defer, response);
				};
			})(this));
		return defer.promise;
	};


	/* POST SERVICESE CALLS */

	Baazar.prototype.postRecipe = function (recipe) {
		var defer;
		defer = this.$q.defer();
		this.$http.post(postRecipeUrl, recipe)
			.success((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.postComment = function (recipeID, comment) {
		var defer, url;
		defer = this.$q.defer();
		url = "" + this.postCommentUrl + "/" + recipeID;
		this.$http.post(url, comment)
			.success((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	Baazar.prototype.giveKarmaToRecipe = function (recipeID, karma) {
		var defer, url;
		defer = this.$q.defer();
		url = "" + this.giveKarmaToRecipeUrl + "/" + recipeID;
		this.$http.post(url, karma)
			.success((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this))
			.error((function (_this) {
				return function (response, status) {
					_this.handlePostCall(defer, response);
				};
			})(this));
		return defer.promise;
	};

	return Baazar;

})();

BaazarModule = angular.module('BaazarModule', []);
BaazarModule.service(['$q', '$http', Baazar]);