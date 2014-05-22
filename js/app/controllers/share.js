// Generated by CoffeeScript 1.3.3
(function() {
  var MonkeyWrench, ShareProjectController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MonkeyWrench = angular.module('MonkeyWrench');

  ShareProjectController = (function() {

    ShareProjectController.$inject = ['$scope', '$routeParams', '$location', '$timeout', 'GPauth', 'Baazar', 'Project', 'Alert'];

    function ShareProjectController(scope, routeParams, location, timeout, gp, Baazar, Project, Alert) {
      var pid,
        _this = this;
      this.scope = scope;
      this.routeParams = routeParams;
      this.location = location;
      this.timeout = timeout;
      this.gp = gp;
      this.Baazar = Baazar;
      this.Project = Project;
      this.Alert = Alert;
      this.getUserInfo = __bind(this.getUserInfo, this);

      this.share = __bind(this.share, this);

      this.updateRecipeId = __bind(this.updateRecipeId, this);

      this.handle_response = __bind(this.handle_response, this);

      this.resetFileInput = __bind(this.resetFileInput, this);

      this.isDisabled = __bind(this.isDisabled, this);

      this.isEmpty = __bind(this.isEmpty, this);

      pid = this.routeParams.pid;
      if (pid !== null && pid !== void 0) {
        this.scope.curProject = angular.copy(this.Project.get(pid));
      } else {
        this.location.path('/');
      }
      if (this.scope.curProject === null || this.scope.curProject === void 0) {
        this.location.path('/');
      }
      if (this.scope.curProject.forked) {
        this.Alert.error('Opps...can not share installed Recipe...instead FORK it and then make it AWESOME.');
        this.location.path('/');
      }
      this.gp.load().then(function() {
        return _this.getUserInfo();
      }, function() {
        _this.scope.user = null;
        _this.scope.signedIn = false;
        return _this.Alert.error("You must LOG IN in-order to share Recipe.");
      });
      this.scope.share = this.share;
      this.scope.isDisabled = this.isDisabled;
      this.scope.disableShareButton = false;
      return;
    }

    ShareProjectController.prototype.isEmpty = function(value) {
      return [null, void 0, ""].indexOf(value) > -1;
    };

    ShareProjectController.prototype.isDisabled = function() {
      if (this.isEmpty(this.scope.curProject.name) || this.isEmpty(this.scope.curProject.desc) || this.scope.disableShareButton) {
        return true;
      } else {
        return false;
      }
    };

    ShareProjectController.prototype.resetFileInput = function() {
      var _this = this;
      this.scope.disableShareButton = true;
      return this.timeout(function() {
        return _this.location.path('/');
      }, 3000);
    };

    ShareProjectController.prototype.handle_response = function(response) {
      this.resetFileInput();
      this.updateRecipeId(response._id);
      return this.Alert.success(response.msg);
    };

    ShareProjectController.prototype.updateRecipeId = function(recipeId) {
      this.scope.curProject['_id'] = recipeId;
      return this.Project.save(this.scope.curProject);
    };

    ShareProjectController.prototype.share = function() {
      var curProject, file, fileSelect, files, formData, requestURL, xhr, _i, _len,
        _this = this;
      if (!this.scope.signedIn) {
        this.Alert.error("You must LOG IN in-order to share Recipe.");
        return;
      }
      curProject = angular.copy(this.scope.curProject);
      requestURL = this.Baazar.domain + '/saveRecipe';
      fileSelect = document.getElementById('imgs');
      files = fileSelect.files;
      if (files.length < 2) {
        alert("please select atleast 2 files");
        return;
      }
      formData = new FormData();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (!file.type.match('image.*')) {
          continue;
        }
        formData.append('imgs', file, file.name);
      }
      formData.append('title', curProject.name);
      formData.append('desc', curProject.desc);
      formData.append('author', this.scope.user._id);
      formData.append('ingredients', JSON.stringify(curProject));
      xhr = new XMLHttpRequest();
      xhr.open('POST', requestURL, true);
      xhr.onload = function() {
        var response;
        if (xhr.status === 200) {
          response = JSON.parse(xhr.responseText);
          return _this.scope.$apply(function() {
            return _this.handle_response(response);
          });
        } else {
          return _this.scope.$apply(function() {
            resetFileInput();
            return _this.Alert.error("An Army of heavily trained monkeys is dispatched to deal with this situation....hang in there....");
          });
        }
      };
      return xhr.send(formData);
    };

    ShareProjectController.prototype.getUserInfo = function() {
      var _this = this;
      return this.gp.getUserInfo().then(function(user) {
        _this.scope.user = user;
        return _this.scope.signedIn = true;
      }, function() {
        return _this.gp.signOut();
      });
    };

    return ShareProjectController;

  })();

  MonkeyWrench.controller('ShareProjectController', ShareProjectController);

}).call(this);
