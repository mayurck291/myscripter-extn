// Generated by CoffeeScript 1.3.3
(function() {
  var MonkeyWrench, Project,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Project = (function() {

    function Project(Alert) {
      this.Alert = Alert;
      this.install = __bind(this.install, this);

    }

    Project.prototype["new"] = function() {
      var template;
      return template = {
        name: null,
        url: null,
        external: {
          js: [],
          css: []
        },
        js: null,
        css: null,
        enabled: true,
        autoApply: true,
        forked: false
      };
    };

    Project.prototype.isEmpty = function(value) {
      return [null, void 0, ""].indexOf(value) > -1;
    };

    Project.prototype.nextSequence = function() {
      var seq;
      seq = $.jStorage.get('sequence');
      if (seq != null) {
        $.jStorage.set('sequence', seq + 1);
        return seq;
      } else {
        $.jStorage.set('sequence', 2);
        return 1;
      }
    };

    Project.prototype.getIndices = function() {
      var indexes;
      indexes = $.jStorage.get('prjmyindexes_9');
      if (indexes != null) {
        return indexes;
      } else {
        return {};
      }
    };

    Project.prototype.saveIndices = function(indexes) {
      return $.jStorage.set('prjmyindexes_9', indexes);
    };

    Project.prototype.saveProject = function(id, project) {
      return $.jStorage.set(id, project);
    };

    Project.prototype.save = function(project, old_url) {
      var all_indexes, cur_url;
      if (this.isEmpty(project.id)) {
        project.id = this.nextSequence();
      }
      this.saveProject(project.id, project);
      all_indexes = this.getIndices();
      cur_url = project.url;
      if (this.isEmpty(all_indexes[cur_url])) {
        all_indexes[cur_url] = [];
      }
      if (this.isEmpty(old_url)) {
        old_url = cur_url;
      }
      if (all_indexes[cur_url].indexOf(project.id) === -1) {
        all_indexes[cur_url].push(project.id);
      }
      if (cur_url !== old_url && all_indexes[old_url] && all_indexes[old_url].indexOf(project.id) > -1) {
        all_indexes[old_url].splice(all_indexes[old_url].indexOf(project.id), 1);
      }
      this.saveIndices(all_indexes);
    };

    Project.prototype["delete"] = function(project) {
      var all_indexes;
      all_indexes = this.getIndices();
      $.jStorage.deleteKey(project.id);
      all_indexes[project.url].splice(all_indexes[project.url].indexOf(project.id), 1);
      this.saveIndices(all_indexes);
    };

    Project.prototype.get = function(id) {
      return $.jStorage.get(id);
    };

    Project.prototype.getAll = function() {
      var projects;
      projects = $.jStorage.get('prjmyindexes_9');
      if (projects !== null && projects !== void 0) {
        return projects;
      } else {
        return {};
      }
    };

    Project.prototype.install = function(project) {};

    return Project;

  })();

  MonkeyWrench = angular.module('MonkeyWrench');

  MonkeyWrench.service('Project', ['Alert', Project]);

}).call(this);
