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

	var controller = todoController();
	var state = controller.state;
	var handlers = controller.handlers;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return state;
			// return {
			// 	nowShowing: app.ALL_TODOS,
			// 	editing: null,
			// 	newTodo: ''
			// };
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: state.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: state.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: state.COMPLETED_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			state.newTodo = event.target.value;
			this.forceUpdate();
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}
			handlers.addTodo(state.newTodo);
			state.newTodo = '';
			this.forceUpdate();

			// var val = this.state.newTodo.trim();
			//
			// if (val) {
			// 	this.props.model.addTodo(val);
			// 	this.setState({newTodo: ''});
			// }
		},

		toggleAll: function (event) {
			// var checked = event.target.checked;
			// this.props.model.toggleAll(checked);
			handlers.toggleAll();
			this.forceUpdate();
		},

		toggle: function (todoToToggle) {
			// this.props.model.toggle(todoToToggle);
			handlers.toggleCompleted(todoToToggle);
			this.forceUpdate();
		},

		destroy: function (todo) {
			// this.props.model.destroy(todo);
			handlers.removeTodo(todo);
			this.forceUpdate();
		},

		edit: function (todo) {
			// this.setState({editing: todo.id});
			handlers.editTodo(todo);
			this.forceUpdate();
		},

		save: function (todoToSave, text) {
			// this.props.model.save(todoToSave, text);
			// this.setState({editing: null});
			handlers.saveEdits(todoToSave, text);
			this.forceUpdate();
		},

		cancel: function (todo) {
			// this.setState({editing: null});
			handlers.revertEdits(todo);
			this.forceUpdate();
		},

		clearCompleted: function () {
			// this.props.model.clearCompleted();
			handlers.clearCompletedTodos();
			this.forceUpdate();
		},

		render: function () {
			var footer;
			var main;

			var todoItems = state.filteredTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={todo.editing}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel.bind(this, todo)}
					/>
				);
			}, this);


			if (state.remainingCount || state.completedCount) {
				footer =
					<TodoFooter
						count={state.remainingCount}
						completedCount={state.completedCount}
						nowShowing={state.filter}
						onClearCompleted={this.clearCompleted}
						onChangeFilter={handlers.updateFilter}
					/>;
			}

			if (state.filteredTodos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={state.remainingCount === 0}
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
							value={state.newTodo}
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
