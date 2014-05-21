// Generated by CoffeeScript 1.3.3
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
      this.authenticationURL = 'https://www.googleapis.com/plus/v1/people/me?fields=aboutMe,displayName,emails,image,url';
      this.accessToken = null;
      this.userInfo = null;
    }

    GPauth.prototype.getState = function() {
      return this.state;
    };

    GPauth.prototype.getToken = function(interactive) {
      var defer, option,
        _this = this;
      defer = this.$q.defer();
      this.state = this.STATE_ACQUIRING_AUTH_TOKEN;
      option = {
        interactive: interactive
      };
      chrome.identity.getAuthToken(option, function(accessToken) {
        if (chrome.runtime.lastError) {
          _this.userInfo = null;
          defer.reject(chrome.runtime.lastError);
        } else {
          _this.accessToken = accessToken;
          defer.resolve();
        }
      });
      return defer.promise;
    };

    GPauth.prototype.requestUserData = function() {
      var config, defer,
        _this = this;
      defer = this.$q.defer();
      this.retry = true;
      config = {
        headers: {
          "Authorization": "Bearer " + this.accessToken
        }
      };
      this.$http.get(this.authenticationURL, config).success(function(response, status) {
        if (status === 200) {
          _this.userInfo = {
            _id: response.emails[0]["value"],
            name: response.displayName,
            img: response.image.url,
            authToken: _this.accessToken,
            url: response.url
          };
          _this.state = _this.STATE_AUTH_TOKEN_ACQUIRED;
          defer.resolve(_this.userInfo);
        } else {
          _this.state = _this.START_STATE;
          defer.reject(response);
        }
      }).error(function(response, status) {
        if (_this.retry && status === 401) {
          chrome.identity.removeCachedAuthToken({
            token: _this.accessToken
          }, _this.getToken);
          _this.retry = false;
        }
      });
      return defer.promise;
    };

    GPauth.prototype.getUserInfo = function(interactive) {
      var defer;
      defer = this.$q.defer();
      if (this.state === this.STATE_AUTH_TOKEN_ACQUIRED) {
        defer.resolve(this.userInfo);
      } else {
        return this.requestUserData();
      }
      return defer.promise;
    };

    GPauth.prototype.signIn = function() {
      return this.getToken(true);
    };

    GPauth.prototype.signOut = function() {
      var defer, option, url,
        _this = this;
      this.userInfo = null;
      defer = this.$q.defer();
      url = "https://accounts.google.com/o/oauth2/revoke?token=" + this.accessToken;
      option = {
        token: this.accessToken
      };
      chrome.identity.removeCachedAuthToken(option, function() {
        return _this.$http.get(url).success(defer.resolve).error(defer.reject);
      });
      this.state = this.START_STATE;
      return defer.promise;
    };

    GPauth.prototype.load = function() {
      return this.getToken(false);
    };

    return GPauth;

  })();

  AuthModule = angular.module('AuthModule', []);

  AuthModule.service('GPauth', ["$http", "$q", GPauth]);

}).call(this);
