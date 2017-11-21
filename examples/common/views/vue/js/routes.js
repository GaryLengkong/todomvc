/*global app, Router */

(function (app, Router) {

	'use strict';

	var router = new Router();

	['all', 'active', 'completed'].forEach(function (filter) {
		router.on(filter, function () {
			app.setFilter(filter);
		});
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			app.visibility = 'all';
		}
	});

	router.init();

})(app, Router);
