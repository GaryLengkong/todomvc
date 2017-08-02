/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	app.TodoFooter = React.createClass({
		render: function () {
			var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						className="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed
					</button>
				);
			}

			var filter = this.props.filter;
			return (
				<footer className="footer">
					<span className="todo-count">
						<strong>{this.props.count}</strong> {activeTodoWord} left
					</span>
					<ul className="filters">
						<li>
							<a href="#/" className={classNames({selected: filter === app.constants.ALL_TODOS})}>All</a>
						</li>
						<li>
							<a href="#/active" className={classNames({selected: filter === app.constants.ACTIVE_TODOS})}>Active</a>
						</li>
						<li>
							<a href="#/completed" className={classNames({selected: filter === app.constants.COMPLETED_TODOS})}>Completed</a>
						</li>
					</ul>
					{clearButton}
				</footer>
			);
		}
	});
})();
