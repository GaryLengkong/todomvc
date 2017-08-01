var backend = {
  getTodos: getTodos,
  getInfo: getInfo
}

function getTodos(name) {
  // Fetch todos from backend
  return Promise.resolve([]);
}

function getInfo() {
  // Fetch data from backend
  return Promise.resolve({});
}

var util = {
  getRouteParameters: getRouteParameters,
  wrapFunction: wrapFunction,
  wrapFunctions: wrapFunctions,
  getController: getController,
  getItemFromStore: getItemFromStore,
  setItemInStore: setItemInStore
}

function getRouteParameters() {
  var parameters = {};
  decodeURIComponent(window.location.hash).split("&").map(function(parameter) {
    var keyValuePair = parameter.split("=");
    parameters[keyValuePair[0]] = keyValuePair[1];
  });
  return parameters;
}

/**
 * Executes before function before and after function after
 * executing functionToWrap
 */
function wrapFunction(functionToWrap, before, after, thisObject) {
  return function () {
    var args = Array.prototype.slice.call(arguments),
        result;
    if (before) before.apply(thisObject || this, args);
    result = functionToWrap.apply(thisObject || this, args);
    if (after) after.apply(thisObject || this, args);
    return result;
  }
}

function wrapFunctions(functionsToWrap, before, after, thisObject) {
  var wrappedFunctions = {};
  for (var i in functionsToWrap) {
    wrappedFunctions[i] = wrapFunction(functionsToWrap[i], before, after, thisObject);
  }
  return wrappedFunctions;
}

function getController(state, data, handlers, update, constants, thisObject) {
  // Call update to get computed states
  update();

  return {
    state: state,
    data: data,
    handlers: wrapFunctions(handlers, null, update, thisObject),
    constants: constants
  };
}

function getItemFromStore(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function setItemInStore(key, value) {
  return sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 */
function todoController(updateView) {

  var constants = {
    NAME_URL_PARAM: 'name',
    STORE_KEY: 'todo',
    ALL_TODOS: 'all',
    ACTIVE_TODOS: 'active',
    COMPLETED_TODOS: 'completed',
  };

  var state = getState();

  var data = getData();

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
    getFilteredTodos: getFilteredTodos,
    getCompletedCount: getCompletedCount,
    getRemainingCount: getRemainingCount,
    isAllCompleted: isAllCompleted
  };

  return getController(state, data, handlers, update, constants, this);

  function getState() {
    // Get name of object from route param and retrieve data from the backend
    var routeParams = util.getRouteParameters();
    var todosName = routeParams[constants.NAME_URL_PARAM];
    if (todosName) {
      return getStateForExistingTodos(todosName);
    } else {
      // If we are not loading existing object, get saved state from the client store
      var storedState = getStateFromStore();
      return storedState ? storedState : getInitialState();
    }
  }

  function getStateForExistingTodos() {
    var state = getInitialState();
    state.isLoaded = false;
    loadTodos(todosName);
    return state;
  }

  function loadTodos() {
    // Populate state based on data from backend
    return backend.getTodos(todosName).then(function(todos) {
      state.todos = todos;
      state.isLoaded = true;
    });
  }

  /**
   * Data is the object that contains information that are not related to the
   * state of the UI and has to be reloaded every time a page is refreshed.
   * For example: The list of pools for the default pool dropdown in virtual
   * server page.
   */
  function getData() {
    // Fetch backend data
    loadData();
    return {};
  }

  function loadData() {
    return backend.getInfo().then(function(info) {
      data.info = info;
    });
  }

  function getInitialState() {
    return {
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
    updateStateInStore();
    if (updateView) {
      updateView(state);
    }
  }

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

  function getStateFromStore() {
    return util.getItemFromStore(constants.STORE_KEY);
  }

  function updateStateInStore() {
    return util.setItemInStore(constants.STORE_KEY, state);
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
