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
