// var MyScriptsModule = angular.module('MyScriptsModule', []);
function MyScriptsController($scope) {
    $scope.view_mode = 'search_mode';
    $('.alert_box').hide();

    $scope.create_new = function() {
        $scope.cur_project = {
            name: '',
            url: '',
            external: {
                js: [],
                css: []
            },
            js: '',
            css: '',
            enabled: true,
            autoApply: false
        };

        $scope.view_mode = 'edit_mode';
    };

    $scope.add_custom_js = function() {
        var custom_url = $scope.custom_js;
        if (nullOrEmpty(custom_url)) {
            return;
        }

        $scope.cur_project.external.js.push(custom_url);
        $scope.custom_js = undefined;
    };

    $scope.add_custom_css = function() {
        var custom_url = $scope.custom_css;
        if (nullOrEmpty(custom_url)) {
            return;
        }

        $scope.cur_project.external.css.push(custom_url);
        $scope.custom_css = undefined;
    };

    $scope.remove_external_js = function(key) {
        $scope.cur_project.external.js.splice(key, 1);
    };

    $scope.remove_external_css = function(key) {
        $scope.cur_project.external.css.splice(key, 1);
    };

    $scope.move_up = function(key, array) {
        var value = array[key];
        array[key] = array[key - 1];
        array[key - 1] = value;
    };

    $scope.move_down = function(key, array) {
        var value = array[key];
        array[key] = array[key + 1];
        array[key + 1] = value;
    };

    function nullOrEmpty(input) {
        return ['', undefined, null].indexOf(input) > -1;
    }

    $scope.save_project = function() {
        if (nullOrEmpty($scope.cur_project.id)) {
            $scope.cur_project.id = Math.random().toString().indexOf(2);
        }

        // var all_projects = get_all_projects();

        // all_projects[$scope.cur_project.id] = $scope.cur_project;
        // save_all_projects(all_projects);

        save_project($scope.cur_project.id, $scope.cur_project);

        var all_indexes = get_all_indexes();

        var cur_url = $scope.cur_project.url;
        if (nullOrEmpty(all_indexes[cur_url])) {
            all_indexes[cur_url] = [];
        }

        if (all_indexes[cur_url].indexOf($scope.cur_project.id) == -1) {
            all_indexes[cur_url].push($scope.cur_project.id);
        }

        save_all_indexes(all_indexes);

    };

    $scope.get_project = function(id) {
        $scope.cur_project = $.jStorage.get(id);
        $scope.view_mode = 'edit_mode';
    };

    function get_all_projects() {
        return nullOrEmpty($.jStorage.get('prjmyscripts_9')) ? {} : $.jStorage.get('prjmyscripts_9');
    }

    function get_all_project_names() {
        var prjmyindexes_9 = nullOrEmpty($.jStorage.get('prjmyindexes_9')) ? {} : $.jStorage.get('prjmyindexes_9');

        var project_ids = [];
        for (url in prjmyindexes_9) {
            var arr = prjmyindexes_9[url];
            project_ids = project_ids.concat(arr);
        }

        var project_names = [];
        project_ids.forEach(function(id) {
            var project = $.jStorage.get(id);

            var cur_project = {};
            cur_project.id = project.id;
            cur_project.name = project.name;
            cur_project.url = project.url;
            cur_project.active = '';

            project_names.push(cur_project);
        });

        $scope.all_project_names = project_names;

    };

    get_all_project_names();

    $scope.have_projects = function() {
        return $scope.all_project_names.length != 0;
    };

    function save_all_projects(projects) {
        $.jStorage.set('prjmyscripts_9', projects);
    }

    function save_project(id, project) {
        $.jStorage.set(id, project);
        $('.alert_box').show();

        setTimeout(function() {
            $('.alert_box').hide();
        }, 2500);
        return true;
    }

    function get_all_indexes() {
        return nullOrEmpty($.jStorage.get('prjmyindexes_9')) ? {} : $.jStorage.get('prjmyindexes_9');
    }

    function save_all_indexes(indexes) {
        $.jStorage.set('prjmyindexes_9', indexes);
    }

    $scope.show_help = function() {
        $('#modal_help').modal('show');
    };
};