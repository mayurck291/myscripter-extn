// Generated by CoffeeScript 1.3.3
(function() {
  var HomeController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HomeController = (function() {

    HomeController.$inject = ['$scope', '$routeParams', '$timeout', '$location', 'Baazar', 'GPauth', 'Alert', 'Project'];

    function HomeController(scope, routeParams, timeout, location, Baazar, gp, Alert, Project) {
      var _this = this;
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
      this.gp.load().then(function() {
        return _this.getUserInfo();
      }, function() {
        _this.scope.user = null;
        _this.scope.signedIn = false;
        return console.log("User not signed in");
      });
      this.timeout(function() {
        var cbtab, tabs;
        tabs = document.getElementById('home');
        return cbtab = new CBPFWTabs(tabs);
      }, 100, true);
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
      var _this = this;
      return this.gp.getUserInfo().then(function(user) {
        _this.scope.user = user;
        return _this.scope.signedIn = true;
      }, function() {
        return _this.gp.signOut();
      });
    };

    HomeController.prototype.deleteUserInfo = function() {
      this.scope.user = null;
      return this.scope.signedIn = false;
    };

    HomeController.prototype.signIn = function() {
      var _this = this;
      console.log(this.gp);
      console.log("signing in .....");
      this.Alert.warning("Loading...........:)");
      this.gp.signIn().then(function() {
        return _this.getUserInfo();
      }, function(error) {
        return console.log(error);
      });
    };

    HomeController.prototype.signOut = function() {
      var _this = this;
      console.log("signing out.....");
      this.gp.signOut().then(function() {
        return console.log("out");
      }, function() {
        return console.log("not out");
      });
      this.scope.user = null;
      this.scope.signedIn = false;
    };

    HomeController.prototype.save = function(project) {
      project.enabled = !project.enabled;
      return this.Project.save(project);
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
      if (forked._id != null) {
        delete forked._id;
      }
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
      var _this = this;
      return this.scope.$apply(function() {
        project = angular.fromJson(project);
        project.forked = false;
        project.name += " (imported)";
        delete project.id;
        _this.Alert.success("Successfully imported recipe ...! " + project.name + " will appear in 'My Recipes'");
        _this.Project.save(project);
        return _this.getAllProjects();
      });
    };

    return HomeController;

  })();

  MonkeyWrench.controller('HomeController', HomeController);

}).call(this);
