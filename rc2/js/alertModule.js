"use strict";
var AlertModule = angular.module("AlertDivModule", []);

AlertModule.factory("alertDivService", function ($timeout) {
	var alert = {};
	alert.message = "";
	alert.class = "";
	alert.show = false;

	var classError = "alert alert-error";
	var classSuccess = "alert alert-success";
	var classWarning = "alert alert-warning";

	function playBeepSound() {
		var beepSound = document.getElementById("beepSound");
		beepSound.play();
	}

	var obj = {};

	obj.bind = function () {
		return alert;
	};

	obj.hideAlert = function () {
		alert.show = false;
		alert.class = "";
		alert.message = "";
	};

	obj.showAlertError = function (message, timeout) {
		alert.message = message;
		alert.show = true;
		alert.class = classError;
		if (!timeout) {
			$timeout(this.hideAlert, 2500)
		}
	};

	obj.showAlertSuccess = function (message, timeout) {
		alert.message = message;
		alert.show = true;
		alert.class = classSuccess;
		if (!timeout) {
			$timeout(this.hideAlert, 2500)
		}
	};

	obj.showAlertWarning = function (message, timeout) {
		alert.message = message;
		alert.show = true;
		alert.class = classWarning;
		if (!timeout) {
			$timeout(this.hideAlert, 2500)
		}
	};
	return obj;
});

AlertModule.directive("alertDiv", function (alertDivService) {
	return {
		restrict: "E",
		transclude: true,
		template: "<div ng-transclude></div>",
		controller: function ($scope, alertDivService) {
			$scope.alert = alertDivService.bind();
		}
	};
});