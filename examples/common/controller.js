/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 * Route parameters can also be passed in if using view
 * specific router.
 */
function todoController(updateView, routeParams) {

  var state = {
    filter: constants.ALL_TODOS,
    todos: [],
    editedTodo: null,
    filteredTodos: [],
    remainingCount: 0,
    completedCount: 0,
    newTodo: '',
    allChecked: false,
    originalTodo: '',
    isLoaded: true
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
    /*
    getFilteredTodos: getFilteredTodos,
    getCompletedCount: getCompletedCount,
    getRemainingCount: getRemainingCount,
    isAllCompleted: isAllCompleted
    */
  };

  activate();

  // This will cause update to be called once and after every call to any method in handlers
  // It's a convenience function to make sure that developers don't forget to do it
  return getController(state, handlers, update);

  // Alternatively
  /*
  return {
    state: state,
    handlers: util.wrapFunctions(handlers, null, update, this),
    constants: constants
  };
  */

  function activate() {
    // Get name of object from route param and retrieve data from the backend
    // Optionally you can get
    if (!routeParams) {
      routeParams = util.getRouteParameters();
    }
    var todosName = routeParams[constants.NAME_URL_PARAM];
    if (todosName) {
      // Load model data from backend (no ui state)
      loadTodos(todosName);
    } else {
      // Load data from client side storage (including saved ui state)
      loadStateFromStore();
    }

    // Do this after loading state from store
    setFilter(routeParams.filter);

    // Load dynamic data (that will not be saved)
    loadData();
  }

  function loadTodos(todosName) {
    state.isLoaded = false;
    // Populate state based on data from backend
    return backend.getTodos(todosName).then(function(todos) {
      state.todos = todos;
      state.isLoaded = true;
      update();
    });
  }

  function loadStateFromStore() {
    var storedState = getStateFromStore();
    state = storedState ? storedState : state;
  }

  // Load dynamic data, e.g. list of available pools
  function loadData() {
    return backend.getInfo().then(function(info) {
      state.info = info;
      update();
    });
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

  // Methods only used by react

  function setNewTodo(value) {
    state.newTodo = value;
  }

  function setEditedTodo(value) {
    state.editedTodo.title = value;
  }

  // Update methods

  function update() {
    // Update computed states
    updateFilteredTodos();
    updateCounts();

    updateStateInStore();
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
    state.isAllFiltered = !state.filter || state.filter === constants.ALL_TODOS;
    state.isActiveFiltered = state.filter === constants.ACTIVE_TODOS;
    state.isCompletedFiltered = state.filter === constants.COMPLETED_TODOS;

    state.filteredTodos = state.todos.filter(function(todo) {
      return state.isAllFiltered ? true :
        state.isCompletedFiltered ? todo.completed : !todo.completed;
    });
  }

  // Methods for storing, retrieving state from store

  function getStateFromStore() {
    return util.getItemFromStore(constants.STORE_KEY);
  }

  function updateStateInStore() {
    return util.setItemInStore(constants.STORE_KEY, state);
  }

  // Optional getters for computed states (states that derive values from other states)
  // No need to call updateCounts and updateFilteredTodos in the update function if
  // we use this, but performance will be worse off.
  /*
  function getRemainingCount() {
    return state.todos.filter(function(todo) {
      return !todo.completed;
    }).length;
  }

  function getCompletedCount() {
    return state.todos.filter(function(todo) {
      return todo.completed;
    }).length;
  }

  function isAllCompleted() {
    return state.remainingCount === 0;
  }

  function getFilteredTodos() {
    if (state.filter === constants.ACTIVE_TODOS) {
      return state.todos.filter(function(todo) {
        return !todo.completed;
      });
    } else if (state.filter === constants.COMPLETED_TODOS) {
      return state.todos.filter(function(todo) {
        return todo.completed;
      });
    } else if (state.filter === constants.ALL_TODOS || state.filter === ''){
      return state.todos;
    }
  }
  */

}
