/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 * Route parameters can also be passed in if using view
 * specific router.
 */
function todoController(updateViewState, routeParams) {

  var state = {
    filter: constants.ALL_TODOS,
    todos: [],
    editedTodo: null,
    filteredTodos: [],
    remainingCount: 0,
    completedCount: 0,
    newTodo: '',
    isAllCompleted: false,
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
    // Methods used by react
    // React apps shouldn't update values on its own using setState because setState will generate
    // a new object instead of updating the existing object.
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
    state.isAllCompleted = !state.isAllCompleted;
    state.todos.forEach(function (todo) {
      todo.completed = state.isAllCompleted;
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
    updateComputedStates();

    updateStateInStore();
    if (updateViewState) {
      updateViewState(state);
    }
  }

  /**
   * Writing it this way guarantees no circular dependency between states,
   * since it's only called maximum once after a view event is handled.
   * The downside is that this method must be called manually if the handler
   * method is triggered by a backend event.
   */
  function updateComputedStates() {
    var completed = state.todos.filter(function(todo) {
      return todo.completed;
    });
    var remaining = state.todos.filter(function(todo) {
      return !todo.completed;
    });
    state.remainingCount = remaining.length;
    state.completedCount = completed.length;
    state.isAllCompleted = state.remainingCount === 0;
    state.isAllFiltered = !state.filter || state.filter === constants.ALL_TODOS;
    state.isActiveFiltered = state.filter === constants.ACTIVE_TODOS;
    state.isCompletedFiltered = state.filter === constants.COMPLETED_TODOS;
    state.filteredTodos = state.isAllFiltered ? state.todos : state.isCompletedFiltered ? completed : remaining;
  }

  // Methods for storing, retrieving state from store

  function getStateFromStore() {
    return util.getItemFromStore(constants.STORE_KEY);
  }

  function updateStateInStore() {
    return util.setItemInStore(constants.STORE_KEY, state);
  }

}
