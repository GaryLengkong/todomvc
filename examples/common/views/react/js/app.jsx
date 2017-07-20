/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({

		getInitialState: function() {
			this.controller = todoController(this.forceUpdate.bind(this));
			this.handlers = this.controller.handlers;
			app.constants = this.controller.constants;
			return this.controller.state;
		},

		handleNewTodoChange: function (event) {
			this.handlers.setNewTodo(event.target.value);
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}
			this.handlers.addTodo();
		},

		render: function () {
			var footer;
			var main;

			var todoItems = this.state.filteredTodos.map(function (todo) {
				return (
					<TodoItem
						todo={todo}
						editedTodo={this.state.editedTodo}
						onEscape={this.handlers.revertEdits.bind(this, todo)}
						onEditChange={this.handlers.setEditedTodo}
						onSubmit={this.handlers.saveEdits.bind(this, todo)}
						onDestroy={this.handlers.removeTodo.bind(this, todo)}
						onDoubleClick={this.handlers.editTodo.bind(this, todo)}
						onToggle={this.handlers.toggleCompleted.bind(this, todo)}
					/>
				);
			}, this);


			if (this.state.remainingCount || this.state.completedCount) {
				footer =
					<TodoFooter
						count={this.state.remainingCount}
						completedCount={this.state.completedCount}
						nowShowing={this.state.filter}
						onClearCompleted={this.handlers.clearCompletedTodos}
						onChangeFilter={this.handlers.setFilter}
					/>;
			}

			if (this.state.filteredTodos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.handlers.toggleAll}
							checked={this.state.remainingCount === 0}
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleNewTodoChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	// var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	// model.subscribe(render);
	render();
})();
