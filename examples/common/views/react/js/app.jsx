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
			return this.controller.state;
		},

		handleChange: function (event) {
			this.state.newTodo = event.target.value;
			this.forceUpdate();
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}
			this.handlers.addTodo(this.state.newTodo);
			this.state.newTodo = '';
		},

		render: function () {
			var footer;
			var main;

			var todoItems = this.state.filteredTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.handlers.toggleCompleted.bind(this, todo)}
						onDestroy={this.handlers.removeTodo.bind(this, todo)}
						onEdit={this.handlers.editTodo.bind(this, todo)}
						editing={todo.editing}
						onSave={this.handlers.saveEdits.bind(this, todo)}
						onCancel={this.handlers.revertEdits.bind(this, todo)}
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
						onChangeFilter={this.handlers.updateFilter}
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
							onChange={this.handleChange}
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
