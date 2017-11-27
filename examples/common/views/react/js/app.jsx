/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({

		getInitialState: function() {
			var getViewState = function() {
				return this.state;
			}.bind(this);
			var setViewState = this.setState.bind(this);
			this.presenter = new TodoPresenter(null, getViewState, setViewState);
			this.handlers = this.presenter.handlers;
			return this.presenter.state;
		},

		componentDidMount: function() {
			var router = Router({
				'/': this.handlers.setFilter.bind(this, this.state.ALL_TODOS),
				'/active' : this.handlers.setFilter.bind(this, this.state.ACTIVE_TODOS),
				'/completed': this.handlers.setFilter.bind(this, this.state.COMPLETED_TODOS)
			});
			router.init('/');
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
					{this.main()}
					{this.state.todos.length > 0 && this.footer()}
				</div>
			);
		},

		main: function() {
			if (this.state.filteredTodos.length) {
				return (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.handlers.toggleAll}
							checked={this.state.isAllCompleted}
						/>
						<ul className="todo-list">
							{this.todoItems()}
						</ul>
					</section>
				);
			}
		},

		todoItems: function() {
			return this.state.filteredTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
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
		},

		footer: function() {
			return (
				<div className="footer">
					<span className="todo-count">
						<strong>{this.state.remainingCount}</strong> {app.Utils.pluralize(this.state.remainingCount, 'item')} left
					</span>
					<ul className="filters">
						<li>
							<a href="#/" className={classNames({selected: this.state.filter === this.state.ALL_TODOS})}>All</a>
						</li>
						<li>
							<a href="#/active" className={classNames({selected: this.state.filter === this.state.ACTIVE_TODOS})}>Active</a>
						</li>
						<li>
							<a href="#/completed" className={classNames({selected: this.state.filter === this.state.COMPLETED_TODOS})}>Completed</a>
						</li>
					</ul>
					{this.state.completedCount > 0 && (
							<button
								className="clear-completed"
								onClick={this.handlers.clearCompletedTodos}>
								Clear completed
							</button>
					)}
				</div>
			);
		},

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
