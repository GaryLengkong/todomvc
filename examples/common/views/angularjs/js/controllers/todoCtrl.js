/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter) {
		'use strict';

		var controller = todoController(null, null, $routeParams);
		$scope.state = controller.state;
		$scope.handlers = controller.handlers;
	});
