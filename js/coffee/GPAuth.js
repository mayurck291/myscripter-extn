// Generated by CoffeeScript 1.7.1
(function() {
  var AuthModule, GPauth;

  GPauth = (function() {
    function GPauth($http, $q) {
      this.$http = $http;
      this.$q = $q;
      this.START_STATE = 1;
      this.STATE_ACQUIRING_AUTH_TOKEN = 2;
      this.STATE_AUTH_TOKEN_ACQUIRED = 3;
      this.state = this.START_STATE;
      this.authenticationURL = 'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe,circledByCount,displayName,emails,image';
    }

    GPauth.prototype.getState = function() {
      return this.state;
    };

    GPauth.prototype.getToken = function(interactive) {
      var defer, option;
      defer = this.$q.defer();
      this.state = this.STATE_ACQUIRING_AUTH_TOKEN;
      option = {
        interactive: interactive
      };
      chrome.identity.getAuthToken(option, (function(_this) {
        return function(accessToken) {
          if (chrome.runtime.lastError) {
            defer.reject(chrome.runtime.lastError);
          } else {
            _this.accessToken = accessToken;
            defer.resolve();
          }
        };
      })(this));
      return defer.promise;
    };

    GPauth.prototype.requestUserData = function() {
      var config, defer;
      defer = this.$q.defer();
      this.retry = true;
      config = {
        headers: {
          "Authorization": "Bearer " + this.accessToken
        }
      };
      this.$http.get(this.authenticationURL, config).success((function(_this) {
        return function(response, status) {
          if (status === 200) {
            _this.state = _this.STATE_AUTH_TOKEN_ACQUIRED;
            defer.resolve(response);
          } else {
            _this.state = _this.START_STATE;
            defer.reject(response);
          }
        };
      })(this)).error((function(_this) {
        return function(response, status) {
          if (_this.retry && status === 401) {
            chrome.identity.removeCachedAuthToken({
              token: _this.accessToken
            }, _this.getToken);
            _this.retry = false;
          }
        };
      })(this));
      return defer.promise;
    };

    GPauth.prototype.getUserInfo = function(interactive) {
      var defer;
      defer = this.$q.defer();
      this.requestUserData().then(defer.resolve, defer.reject);
      return defer.promise;
    };

    GPauth.prototype.signIn = function() {
      var defer;
      defer = this.$q.defer();
      this.getToken(true).then(defer.resolve, defer.reject);
      return defer.promise;
    };

    GPauth.prototype.signOut = function() {
      var defer, option, url;
      defer = this.$q.defer();
      url = "https://accounts.google.com/o/oauth2/revoke?token=" + this.accessToken;
      option = {
        token: this.accessToken
      };
      chrome.identity.removeCachedAuthToken(option, this.$http.get(url).success(defer.resolve).error(defer.reject));
      this.state = this.START_STATE;
      return defer.promise;
    };

    GPauth.prototype.load = function() {
      var defer;
      defer = this.$q.defer();
      this.getToken(false).then(defer.resolve, defer.reject);
      return defer.promise;
    };

    return GPauth;

  })();

  AuthModule = angular.module('AuthModule', []);

  AuthModule.service('GPauth', ["$http", "$q", GPauth]);

}).call(this);
