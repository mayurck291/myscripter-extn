var MyScriptsModule = angular.module('MyScriptsModule', []);
MyScriptsModule.directive('file', function () {
	return {
		scope: {
			// onfileselect: "&"
		},
		controller: function ($scope, $element, $attrs, $transclude) {
			$scope.handleFileSelect = function (evt) {
				$scope.filesData = [];
				var files = evt.target.files; // FileList object
				// console.log( files );

				var f = files[0];
				if (f) {
					var r = new FileReader();
					r.onload = function (e) {
						var contents = e.target.result;
						$scope.$parent.onselect(contents);
					}
					r.readAsText(f);
				} else {
					alert("Failed to load file");
				}
			}

			$scope.openFile = function () {
				console.log("-------------------");
				console.log(angular.element(document.querySelector("#importedFile")));
				angular.element(document.querySelector("#importedFile"))[0].click();
			}
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div class="pull-right"><button class="btn btn-info " ng-click="openFile()">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Import Files&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button><input style="display:none" type="file" accept=".json" class="btn btn-warning pull-right" name="importedFile" id="importedFile" title="Import Files"></div>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function ($scope, iElm, iAttrs, controller) {
			console.log(iElm);
			// var input = iElm[ 0 ];
			iElm.on('change', $scope.handleFileSelect);
		}
	};
});

function MyScriptsController($scope, $http) {

	$scope.onselect = function (content) {
		console.log(content);
		var cur_project = typeof content != "object" ? JSON.parse(content) : content;
		if (cur_project.id) {
			delete cur_project.id;
		}
		$scope.cur_project = angular.copy(cur_project);
		$scope.save_project();
		$scope.$apply(function () {
			get_all_project_names();
		});
	}

	$scope.view_mode = 'search_mode';
	$('.alert_box')
		.hide();


	$scope.create_new = function () {
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
		$scope.cur_project_old_url = undefined;
		unset_export_link();
	};

	$scope.add_custom_js = function () {
		var custom_url = $scope.custom_js;
		if (nullOrEmpty(custom_url)) {
			return;
		}

		$scope.cur_project.external.js.push(custom_url);
		$scope.custom_js = undefined;
	};

	$scope.add_custom_css = function () {
		var custom_url = $scope.custom_css;
		if (nullOrEmpty(custom_url)) {
			return;
		}

		$scope.cur_project.external.css.push(custom_url);
		$scope.custom_css = undefined;
	};

	$scope.remove_external_js = function (key) {
		$scope.cur_project.external.js.splice(key, 1);
	};

	$scope.remove_external_css = function (key) {
		$scope.cur_project.external.css.splice(key, 1);
	};

	$scope.move_up = function (key, array) {
		var value = array[key];
		array[key] = array[key - 1];
		array[key - 1] = value;
	};

	$scope.move_down = function (key, array) {
		var value = array[key];
		array[key] = array[key + 1];
		array[key + 1] = value;
	};

	function nullOrEmpty(input) {
		return ['', undefined, null].indexOf(input) > -1;
	}

	$scope.save_project = function () {
		if (nullOrEmpty($scope.cur_project.name) || nullOrEmpty($scope.cur_project.url)) {
			alert("Project NAME and URL can not be empty. !!");
			return;
		}

		if (nullOrEmpty($scope.cur_project.id)) {
			$scope.cur_project.id = get_sequence();
		}

		save_project($scope.cur_project.id, $scope.cur_project);

		var all_indexes = get_all_indexes();

		var cur_url = $scope.cur_project.url;

		if (nullOrEmpty(all_indexes[cur_url])) {
			all_indexes[cur_url] = [];
		}

		if (nullOrEmpty($scope.cur_project_old_url)) {
			$scope.cur_project_old_url = cur_url;
		}

		if (all_indexes[cur_url].indexOf($scope.cur_project.id) == -1) {
			all_indexes[cur_url].push($scope.cur_project.id);
		}

		if (cur_url != $scope.cur_project_old_url && all_indexes[$scope.cur_project_old_url] && all_indexes[$scope.cur_project_old_url].indexOf($scope.cur_project.id) > -1) {
			all_indexes[$scope.cur_project_old_url].splice(all_indexes[$scope.cur_project_old_url].indexOf($scope.cur_project.id), 1);
		}

		save_all_indexes(all_indexes);
	};

	$scope.delete_project = function () {
		if (!confirm('Are you sure you want to delete this project?')) {
			return;
		}

		var all_indexes = get_all_indexes();
		$.jStorage.deleteKey($scope.cur_project.id);
		all_indexes[$scope.cur_project_old_url].splice(all_indexes[$scope.cur_project_old_url].indexOf($scope.cur_project.id), 1);
		save_all_indexes(all_indexes);

		$scope.close_screen();
	};


	///////////////////////////////////
	//////////////////////////////// //
	///////////////////////////////////
	// TODO file upload directive //
	///////////////////////////////////
	//////////////////////////////// //
	///////////////////////////////////

	var unset_export_link = function () {
		$('#download')
			.html('');
	}

	var set_export_link = function (obj) {
		console.log(obj)
		delete obj.id;
		var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

		$('#download')
			.html('<a class="glyphicon glyphicon-download-alt" type="button" href="data:' + data + '" download="' + obj.name + '.json">Export</a>');
	}

	$scope.get_project = function (id) {
		$scope.cur_project = $.jStorage.get(id);
		$scope.cur_project_old_url = $scope.cur_project.url;
		$scope.view_mode = 'edit_mode';

		set_export_link(angular.copy($scope.cur_project));
	};

	$scope.close_screen = function () {
		get_all_project_names();
		$scope.view_mode = 'search_mode';
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
		project_ids.forEach(function (id) {
			var project = $.jStorage.get(id);

			var cur_project = {};
			cur_project.id = project.id;
			cur_project.name = project.name;
			cur_project.url = project.url;
			cur_project.enabled = project.enabled;

			project_names.push(cur_project);
		});

		$scope.all_project_names = project_names;

	};

	get_all_project_names();

	$scope.have_projects = function () {
		return $scope.all_project_names.length != 0;
	};

	$scope.toggle_status = function (project) {
		$scope.get_project(project.id);
		$scope.cur_project.enabled = !$scope.cur_project.enabled;
		$scope.save_project();
		$scope.close_screen();
	};

	function save_all_projects(projects) {
		$.jStorage.set('prjmyscripts_9', projects);
	}

	function save_project(id, project) {
		$.jStorage.set(id, project);
		$('.alert_box')
			.show();

		setTimeout(function () {
			$('.alert_box')
				.hide();
		}, 2500);
		return true;
	}

	function get_all_indexes() {
		return nullOrEmpty($.jStorage.get('prjmyindexes_9')) ? {} : $.jStorage.get('prjmyindexes_9');
	}

	function save_all_indexes(indexes) {
		$.jStorage.set('prjmyindexes_9', indexes);
	}

	$scope.show_help = function () {
		$('#modal_help')
			.modal('show');
	};

	$scope.show_share_modal = function () {
		$('#modal_share_recipe')
			.modal('show');
	};

	$scope.hide_share_modal = function () {
		$('#modal_share_recipe')
			.modal('hide');
	};

	function get_sequence() {
		var seq = $.jStorage.get('sequence');
		if (nullOrEmpty(seq)) {
			$.jStorage.set('sequence', 2);
			return 1;
		} else {
			$.jStorage.set('sequence', seq + 1);
			return seq;
		}
	}

	$scope.handleKeyBoardEvent = function () {
		if (event.ctrlKey || event.metaKey) {
			console.log(String.fromCharCode(event.which)
				.toLowerCase())
			switch (String.fromCharCode(event.which)
				.toLowerCase()) {
			case 's':
				if ($scope.view_mode === "edit_mode") {
					$scope.save_project();
					event.preventDefault();
				}
				break;
			case 'p':
				event.preventDefault();
				$scope.create_new();
				break;
			case 'h':
				event.preventDefault();
				if ($scope.view_mode == "edit_mode") {
					if (confirm("Are you sure ? all UNSAVED changes will be lost.!!")) {
						$scope.close_screen();
					}
				} else {
					$scope.close_screen();
				}
				break;
			case 'q':
				event.preventDefault();
				if ($scope.view_mode == "edit_mode") {
					if (confirm("Are you sure ? all UNSAVED changes will be lost.!!")) {
						$scope.close_screen();
					}
				}
				break;
			case '¿':
				event.preventDefault();
				$scope.show_help();
				break;
			}
		}
	}
	$scope.exportProject = function (id) {
		// export monkey
		var projects = get_all_projects();
		var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects));
		window.open("_blank", data);
		$scope.settings = data;
		var data = $scope.get_project(id)
	}

	$scope.installRecipe = function (recipe) {
		$scope.cur_project = angular.copy(recipe);
		$scope.save_project();
		get_all_project_names();
	}

	$scope.shareRecipe = function () {
		var obj = {
			title: $scope.share.title,
			desc: $scope.share.desc,
			author: $scope.share.author,
			ingredients: $scope.cur_project
		}
		$http.post('http://localhost:3000/saveRecipe', obj)
			.success(function () {
				handle_response()
			})
			.error(function () {
				handle_response()
			});

		function handle_response() {
			$('.alert_box')
				.show();

			setTimeout(function () {
				$('.alert_box')
					.hide();
			}, 3000);
			$scope.hide_share_modal();
		}
	}

	$scope.getRecipes = function () {
		var url = 'http://localhost:3000/list';
		$scope.loader = true;
		$http.get(url)
			.success(function (data, status) {
				$scope.loader = false;
				if (data) {
					$scope.recipes = data;
					$scope.view_mode = 'baazar';
					console.log(data);
				}
			})
			.error(function () {
				$scope.loader = false;
			})
	}
};