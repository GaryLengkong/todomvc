/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var controller = new todoController();
	var state = controller.state;
	var handlers = controller.handlers;
	handlers.pluralize = function (word, count) {
		return word + (count === 1 ? '' : 's');
	}

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',

		// app initial state
		data: {
			state: state
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: handlers,

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});


})(window);
