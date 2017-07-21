/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 */
function todoController(updateView) {

  var state = {
    filter: "all",
    todos: [],
    editedTodo: null,
    filteredTodos: [],
    remainingCount: 0,
    completedCount: 0,
    newTodo: '',
    allChecked: false
  };

  var constants = {
    ALL_TODOS: 'all',
    ACTIVE_TODOS: 'active',
    COMPLETED_TODOS: 'completed',
  };

  var handlers = {
    addTodo: addTodo,
    editTodo: editTodo,
    saveEdits: saveEdits,
    revertEdits: revertEdits,
    removeTodo: removeTodo,
    toggleCompleted: toggleCompleted,
    clearCompletedTodos: clearCompletedTodos,
    toggleAll: toggleAll,
    setFilter: setFilter,
    setEditedTodo: setEditedTodo,
    setNewTodo: setNewTodo,
    update: update
  };

  return {
    state: state,
    handlers: handlers,
    constants: constants
  };

  function setNewTodo(value) {
    state.newTodo = value;
    update();
  }

  function setEditedTodo(value) {
    state.editedTodo.title = value;
    update();
  }

  function addTodo() {
    if (state.newTodo) {
      var newTodo = {
        title: state.newTodo.trim(),
        completed: false
      };
      state.todos.push(newTodo);
      state.newTodo = '';
      update();
    }
  }

  function editTodo(todo) {
    state.editedTodo = todo;
    state.originalTodo = todo.title;
    update();
  }

  function saveEdits(todo) {
    if (!state.editedTodo) {
      return;
    }
    todo.title = state.editedTodo.title.trim();
    state.editedTodo = null;
    state.originalTodo = '';
    update();
  }

  function revertEdits(todo) {
    todo.title = state.originalTodo;
    state.editedTodo = null;
    state.originalTodo = '';
    update();
  }

  function removeTodo(todo) {
    state.todos.splice(state.todos.indexOf(todo), 1);
    update();
  }

  function toggleCompleted(todo) {
    todo.completed = !todo.completed;
    update();
  }

  function clearCompletedTodos() {
    state.todos = state.todos.filter(function(todo) {
      return !todo.completed;
    });
    update();
  }

  function toggleAll() {
    state.allChecked = !state.allChecked;
    state.todos.forEach(function (todo) {
      todo.completed = state.allChecked;
    });
    update();
  }

  function setFilter(filter) {
    state.filter = filter;
    update();
  }

  function update() {
    updateFilteredTodos();
    updateCounts();
    if (updateView) {
      updateView();
    }
  }

  function updateCounts() {
    state.remainingCount = state.todos.filter(function(todo) {
      return !todo.completed;
    }).length;
    state.completedCount = state.todos.length - state.remainingCount;
    state.allChecked = state.remainingCount === 0;
  }

  function updateFilteredTodos() {
    if (state.filter === constants.ACTIVE_TODOS) {
      state.filteredTodos = state.todos.filter(function(todo) {
        return !todo.completed;
      });
    } else if (state.filter === constants.COMPLETED_TODOS) {
      state.filteredTodos = state.todos.filter(function(todo) {
        return todo.completed;
      });
    } else if (state.filter === constants.ALL_TODOS || state.filter === ''){
      state.filteredTodos = state.todos;
    }
  }
}
