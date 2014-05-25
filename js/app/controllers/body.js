// Generated by CoffeeScript 1.3.3
(function() {
  var BodyController, MonkeyWrench,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MonkeyWrench = angular.module('MonkeyWrench');

  BodyController = (function() {

    BodyController.$inject = ['$scope', '$routeParams', '$timeout', '$location', 'Baazar', 'GPauth', 'Alert', 'Project'];

    function BodyController(scope, routeParams, timeout, location, Baazar, gp, Alert, Project) {
      var _this = this;
      this.scope = scope;
      this.routeParams = routeParams;
      this.timeout = timeout;
      this.location = location;
      this.Baazar = Baazar;
      this.gp = gp;
      this.Alert = Alert;
      this.Project = Project;
      this.handleKeyBoardEvent = __bind(this.handleKeyBoardEvent, this);

      this.help = __bind(this.help, this);

      this.baazar = __bind(this.baazar, this);

      this["new"] = __bind(this["new"], this);

      this.home = __bind(this.home, this);

      this.signOut = __bind(this.signOut, this);

      this.signIn = __bind(this.signIn, this);

      this.deleteUserInfo = __bind(this.deleteUserInfo, this);

      this.getUserInfo = __bind(this.getUserInfo, this);

      this.scope.alert = this.Alert.bind();
      this.scope.signIn = this.signIn;
      this.scope.signOut = this.signOut;
      console.log(this.location.path());
      this.gp.load().then(function() {
        return _this.getUserInfo();
      }, function() {
        _this.scope.user = null;
        _this.scope.signedIn = false;
        return console.log("User not signed in");
      });
      this.scope.home = this.home;
      this.scope["new"] = this["new"];
      this.scope.baazar = this.baazar;
      this.scope.help = this.help;
      this.scope.handleKeyBoardEvent = this.handleKeyBoardEvent;
      this.scope.$on('$routeChangeStart', function(next, current) {
        return _this.scope.showLoader = true;
      });
      this.scope.$on('$routeChangeSuccess', function(next, current) {
        return _this.scope.showLoader = false;
      });
      this.scope.$on('$routeChangeError', function(next, current) {
        return _this.scope.showLoader = false;
      });
      return;
    }

    BodyController.prototype.getUserInfo = function() {
      var _this = this;
      return this.gp.getUserInfo().then(function(user) {
        _this.scope.user = user;
        _this.scope.signedIn = true;
        return _this.scope.$broadcast('login');
      }, function() {
        return _this.gp.signOut();
      });
    };

    BodyController.prototype.deleteUserInfo = function() {
      this.scope.user = null;
      return this.scope.signedIn = false;
    };

    BodyController.prototype.signIn = function() {
      var _this = this;
      this.Alert.warning("Loading...........:)");
      this.gp.signIn().then(function() {
        return _this.getUserInfo();
      }, function(error) {
        return console.log(error);
      });
    };

    BodyController.prototype.signOut = function() {
      var _this = this;
      console.log("signing out.....");
      this.gp.signOut().then(function() {
        return console.log("out");
      }, function() {
        return console.log("not out");
      });
      this.scope.user = null;
      this.scope.signedIn = false;
      this.scope.$broadcast('logout');
    };

    BodyController.prototype.home = function() {
      var _this = this;
      document.getElementsByTagName('body')[0].click();
      return this.timeout(function() {
        return _this.location.path('/');
      }, 0, true);
    };

    BodyController.prototype["new"] = function() {
      var _this = this;
      document.getElementsByTagName('body')[0].click();
      return this.timeout(function() {
        return _this.location.path('/New');
      }, 0, true);
    };

    BodyController.prototype.baazar = function() {
      var _this = this;
      document.getElementsByTagName('body')[0].click();
      return this.timeout(function() {
        return _this.location.path('/Baazar');
      }, 0, true);
    };

    BodyController.prototype.help = function() {
      var _this = this;
      document.getElementsByTagName('body')[0].click();
      return this.timeout(function() {
        return _this.location.path('/Help');
      }, 0, true);
    };

    BodyController.prototype.handleKeyBoardEvent = function(event) {
      var key, path, sure;
      console.log("Called");
      if (event.ctrlKey || event.metaKey) {
        key = String.fromCharCode(event.which).toLowerCase();
        path = this.location.path();
        console.log(path);
        switch (key) {
          case 's':
            if (path === "/New" || path.indexOf('/Edit') > -1) {
              event.preventDefault();
              return this.scope.$broadcast('save');
            }
            break;
          case 'p':
            event.preventDefault();
            if (path === "/New" || path.indexOf('/Edit') > -1) {
              sure = confirm("Are you sure ? all UNSAVED changes will be lost.!!");
              if (sure) {
                return this["new"]();
              }
            } else {
              return this["new"]();
            }
            break;
          case 'h':
            event.preventDefault();
            return this.home();
          case 'b':
            event.preventDefault();
            return this.baazar();
        }
      }
    };

    return BodyController;

  })();

  MonkeyWrench.controller('BodyController', BodyController);

}).call(this);
