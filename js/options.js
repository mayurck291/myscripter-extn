// var MyScriptsModule = angular.module('MyScriptsModule', []);
function MyScriptsController($scope) {
    $scope.view_mode = 'search_mode';

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
            enabled: '',
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

    $scope.move_down = function(key, array) {
        var value = array[key];
        array.splice(key, 1);
        array = insertArray(value, array, key + 1);
    };

    function nullOrEmpty(input) {
        return ['', undefined, null].indexOf(input) > -1;
    }

    function insertArray(value, array, position) {
        var temp = array.splice(0, position);
        temp.push(value);
        array = temp.concat(array);
        return array;
    }

    function save_project() {
        if (nullOrEmpty($scope.cur_project.id)) {
            $scope.cur_project.id = Math.random().toString().indexOf();
        }

        var all_projects = get_all_projects();

        all_projects[$scope.cur_project.id] = $scope.cur_project;
        save_all_projects(all_projects);

        var all_indexes = get_all_indexes();

    }

    function get_project(id) {
        $scope.cur_project = $.jStorage.get(id);
    }
    
    function get_all_projects() {
        return nullOrEmpty($.jStorage.get('prjmyscripts_9')) ? {} : $.jStorage.get('prjmyscripts_9');
    }

    function save_all_projects(projects) {
        $.jStorage.set('prjmyscripts_9', projects);
    }

    function get_all_indexes() {
        return nullOrEmpty($.jStorage.get('prjmyindexes_9')) ? {} : $.jStorage.get('prjmyindexes_9');
    }

    function save_all_indexes(indexes) {
        $.jStorage.set('prjmyindexes_9', indexes);
    }
};