/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = React.createClass({
		/**
		 * This is a completely optional performance enhancement that you can
		 * implement on any React component. If you were to delete this method
		 * the app would still work correctly (and still be very performant!), we
		 * just use it as an example of how little code it takes to get an order
		 * of magnitude performance improvement.
		 */
		shouldComponentUpdate: function (nextProps, nextState) {
			return true;
		},

		handleEditChange: function(event) {
			this.props.onEditChange(event.target.value);
		},

		handleEditKeyDown: function(event) {
	    if (event.which === ESCAPE_KEY) {
	      this.props.onEscape();
	    } else if (event.which === ENTER_KEY) {
	      this.props.onSubmit();
	    }
		},

		/**
		 * Safely manipulate the DOM after updating the state when invoking
		 * `this.props.onEdit()` in the `handleEdit` method above.
		 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
		 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
		 */
		componentDidUpdate: function (prevProps) {
			if (prevProps.editedTodo != this.props.todo  && this.props.editedTodo == this.props.todo) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function () {
			return (
				<li className={classNames({
					completed: this.props.todo.completed,
					editing: this.props.todo == this.props.editedTodo
				})}>
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={this.props.todo.completed}
							onChange={this.props.onToggle}
						/>
						<label onDoubleClick={this.props.onDoubleClick}>
							{this.props.todo.title}
						</label>
						<button className="destroy" onClick={this.props.onDestroy} />
					</div>
					<input
						ref="editField"
						className="edit"
						value={this.props.editedTodo ? this.props.editedTodo.title : ''}
						onBlur={this.props.onSubmit}
						onChange={this.handleEditChange}
						onKeyDown={this.handleEditKeyDown}
					/>
				</li>
			);
		}
	});
})();
