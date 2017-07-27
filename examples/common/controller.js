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
    allChecked: false,
    originalTodo: ''
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
    setNewTodo: setNewTodo
  };

  return getController(state, handlers, update, constants, this);

  // This function should be moved to a utility class/object
  /**
   * Executes before function before and after function after
   * executing functionToWrap
   */
  function wrap(functionToWrap, before, after, thisObject) {
    return function () {
      var args = Array.prototype.slice.call(arguments),
          result;
      if (before) before.apply(thisObject || this, args);
      result = functionToWrap.apply(thisObject || this, args);
      if (after) after.apply(thisObject || this, args);
      return result;
    }
  }

  // This function should be moved to a utility class/object
  function wrapFunctions(functionsToWrap, before, after, thisObject) {
    var wrappedFunctions = {};
    for (var i in functionsToWrap) {
      wrappedFunctions[i] = wrap(functionsToWrap[i], before, after, thisObject);
    }
    return wrappedFunctions;
  }

  // This function should be moved to a utility class/object
  function getController(state, handlers, update, constants, thisObject) {
    return {
      state: state,
      handlers: wrapFunctions(handlers, null, update, thisObject),
      constants: constants
    };
  }

  function setNewTodo(value) {
    state.newTodo = value;
  }

  function setEditedTodo(value) {
    state.editedTodo.title = value;
  }

  function addTodo() {
    if (state.newTodo) {
      var newTodo = {
        title: state.newTodo.trim(),
        completed: false
      };
      state.todos.push(newTodo);
      state.newTodo = '';
    }
  }

  function editTodo(todo) {
    state.editedTodo = todo;
    state.originalTodo = todo.title;
  }

  function saveEdits(todo) {
    if (!state.editedTodo) {
      return;
    }
    todo.title = state.editedTodo.title.trim();
    state.editedTodo = null;
    state.originalTodo = '';
  }

  function revertEdits(todo) {
    todo.title = state.originalTodo;
    state.editedTodo = null;
    state.originalTodo = '';
  }

  function removeTodo(todo) {
    state.todos.splice(state.todos.indexOf(todo), 1);
  }

  function toggleCompleted(todo) {
    todo.completed = !todo.completed;
  }

  function clearCompletedTodos() {
    state.todos = state.todos.filter(function(todo) {
      return !todo.completed;
    });
  }

  function toggleAll() {
    state.allChecked = !state.allChecked;
    state.todos.forEach(function (todo) {
      todo.completed = state.allChecked;
    });
  }

  function setFilter(filter) {
    state.filter = filter;
  }

  function update() {
    updateFilteredTodos();
    updateCounts();
    if (updateView) {
      updateView(state);
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
