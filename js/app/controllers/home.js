// Generated by CoffeeScript 1.7.1
var HomeController, MonkeyWrench,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MonkeyWrench = angular.module('MonkeyWrench');

HomeController = (function() {
  HomeController.$inject = ['$scope', '$routeParams', '$timeout', '$location', 'Baazar', 'GPauth', 'Alert', 'Project'];

  function HomeController(scope, routeParams, timeout, location, Baazar, gp, Alert, Project) {
    this.scope = scope;
    this.routeParams = routeParams;
    this.timeout = timeout;
    this.location = location;
    this.Baazar = Baazar;
    this.gp = gp;
    this.Alert = Alert;
    this.Project = Project;
    this.importProject = __bind(this.importProject, this);
    this["delete"] = __bind(this["delete"], this);
    this.share = __bind(this.share, this);
    this.fork = __bind(this.fork, this);
    this.edit = __bind(this.edit, this);
    this.save = __bind(this.save, this);
    this.signOut = __bind(this.signOut, this);
    this.signIn = __bind(this.signIn, this);
    this.deleteUserInfo = __bind(this.deleteUserInfo, this);
    this.getUserInfo = __bind(this.getUserInfo, this);
    this.getAllProjects = __bind(this.getAllProjects, this);
    this.scope.alert = this.Alert.bind();
    this.scope.signIn = this.signIn;
    this.scope.signOut = this.signOut;
    this.getAllProjects();
    this.gp.load().then((function(_this) {
      return function() {
        return _this.getUserInfo();
      };
    })(this), (function(_this) {
      return function() {
        _this.scope.user = null;
        _this.scope.signedIn = false;
        return console.log("User not signed in");
      };
    })(this));
    this.timeout((function(_this) {
      return function() {
        var cbtab, tabs;
        tabs = document.getElementById('home');
        return cbtab = new CBPFWTabs(tabs);
      };
    })(this), 100, true);
    this.scope.save = this.save;
    this.scope.edit = this.edit;
    this.scope.fork = this.fork;
    this.scope.share = this.share;
    this.scope["delete"] = this["delete"];
    this.scope.getDownloadLink = this.getDownloadLink;
    this.scope.importProject = this.importProject;
    this.scope.$on('login', this.getUserInfo);
    this.scope.$on('logout', this.deleteUserInfo);
    return;
  }

  HomeController.prototype.getAllProjects = function() {
    var id, ids, project_url, projects, _i, _len, _ref, _ref1;
    projects = this.Project.getAll();
    this.scope.projectIds = [];
    for (project_url in projects) {
      ids = projects[project_url];
      (_ref = this.scope.projectIds).push.apply(_ref, ids);
    }
    this.scope.allProjects = [];
    _ref1 = this.scope.projectIds;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      id = _ref1[_i];
      this.scope.allProjects.push(this.Project.get(id));
    }
  };

  HomeController.prototype.getUserInfo = function() {
    return this.gp.getUserInfo().then((function(_this) {
      return function(user) {
        _this.scope.user = user;
        return _this.scope.signedIn = true;
      };
    })(this), (function(_this) {
      return function() {
        return _this.gp.signOut();
      };
    })(this));
  };

  HomeController.prototype.deleteUserInfo = function() {
    this.scope.user = null;
    return this.scope.signedIn = false;
  };

  HomeController.prototype.signIn = function() {
    console.log(this.gp);
    console.log("signing in .....");
    this.Alert.warning("Loading...........:)");
    this.gp.signIn().then((function(_this) {
      return function() {
        return _this.getUserInfo();
      };
    })(this), (function(_this) {
      return function(error) {
        return console.log(error);
      };
    })(this));
  };

  HomeController.prototype.signOut = function() {
    console.log("signing out.....");
    this.gp.signOut().then((function(_this) {
      return function() {
        return console.log("out");
      };
    })(this), (function(_this) {
      return function() {
        return console.log("not out");
      };
    })(this));
    this.scope.user = null;
    this.scope.signedIn = false;
  };

  HomeController.prototype.save = function(project) {
    project.enabled = !project.enabled;
    this.Project.save(project);
    return this.Alert.success("Hurray.....Recipe saved...");
  };

  HomeController.prototype.edit = function(project) {
    var p;
    if (project.forked) {
      return this.Alert.error("Can't edit installed Recipe.....instead FORK it...");
    } else {
      p = "/Edit/" + project.id;
      console.log("path is " + p);
      return this.location.path(p);
    }
  };

  HomeController.prototype.fork = function(project) {
    var forked;
    forked = angular.copy(project);
    forked.forked = false;
    forked.name += " (forked)";
    delete forked.id;
    this.Project.save(forked);
    this.Alert.success("Successfully forked ");
    return this.getAllProjects();
  };

  HomeController.prototype.share = function(project) {
    var p;
    if (project.forked) {
      return this.Alert.error("Can't share installed Recipe.....");
    } else if (!this.scope.signedIn) {
      return this.Alert.error("You must Log In to share Recipe....");
    } else {
      p = "/Share/" + project.id;
      return this.location.path(p);
    }
  };

  HomeController.prototype["delete"] = function(project) {
    if (confirm("Are you sure you want to delete recipe " + project.name)) {
      this.Project["delete"](angular.copy(project));
      return this.getAllProjects();
    }
  };

  HomeController.prototype.importProject = function(project) {
    return this.scope.$apply((function(_this) {
      return function() {
        project = angular.fromJson(project);
        project.forked = false;
        project.name += " (imported)";
        delete project.id;
        _this.Alert.success("Successfully imported recipe ...! " + project.name + " will appear in 'My Recipes'");
        _this.Project.save(project);
        return _this.getAllProjects();
      };
    })(this));
  };

  return HomeController;

})();

MonkeyWrench.controller('HomeController', HomeController);
