// Generated by CoffeeScript 1.3.3
(function() {
  var EditProjectController, MonkeyWrench,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MonkeyWrench = angular.module('MonkeyWrench');

  EditProjectController = (function() {

    EditProjectController.$inject = ['$scope', '$routeParams', '$location', 'Baazar', 'Project', 'Alert'];

    function EditProjectController(scope, routeParams, location, Baazar, Project, Alert) {
      var pid,
        _this = this;
      this.scope = scope;
      this.routeParams = routeParams;
      this.location = location;
      this.Baazar = Baazar;
      this.Project = Project;
      this.Alert = Alert;
      this.save = __bind(this.save, this);

      pid = this.routeParams.pid;
      if (pid !== null && pid !== void 0) {
        this.scope.curProject = this.Project.get(pid);
      } else {
        this.location.path('/');
      }
      if (this.scope.curProject === null || this.scope.curProject === void 0) {
        this.location.path('/');
      }
      if (this.scope.curProject.forked) {
        this.Alert.error('Opps...can not edit installed Recipe...instead FORK it and then make it AWESOME.');
      }
      this.scope.oldurl = this.scope.curProject.url;
      setTimeout(function() {
        var cbtab, tabs;
        tabs = new CBPFWTabs(document.getElementById('form'));
        return cbtab = new CBPFWTabs(tabs);
      }, 300);
      this.scope.save = this.save;
      return;
    }

    EditProjectController.prototype.save = function() {
      console.log("saving....");
      this.Project.save(angular.copy(this.scope.curProject), this.scope.oldurl);
      return this.Alert.success("Hurrah....project saved...");
    };

    return EditProjectController;

  })();

  MonkeyWrench.controller('EditProjectController', EditProjectController);

}).call(this);
