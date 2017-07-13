/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 */
function todoController(update) {
  var todoTemplate = {
  };

  var state = {
    newTodo: "",
    filter: "none",
    todos: [],
    editedTodo: {},
    originalTodo: {},
    remainingCount: 0,
    completedCount: 0
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
    updateFilter: updateFilter
  };

  return {
    state: state,
    handlers: handlers
  };

  function addTodo() {

    if (!state.newTodo) {
      return;
    }

    var newTodo = {
      title: state.newTodo.trim(),
      completed: false
    };
    state.todos.push(newTodo);

    state.newTodo = "";
    updateCounts();

    // $scope.saving = true;
    // store.insert(newTodo)
    //   .then(function success() {
    //     $scope.newTodo = '';
    //   })
    //   .finally(function () {
    //     $scope.saving = false;
    //   });
  }

  function editTodo(todo) {
    state.editedTodo = todo;
    // Clone the original todo to restore it on demand.
    state.originalTodo = angular.extend({}, todo);
  }

  function saveEdits() {
    // For now only handle submit events
    // // Blur events are automatically triggered after the form submit event.
    // // This does some unfortunate logic handling to prevent saving twice.
    // if (event === 'blur' && $scope.saveEvent === 'submit') {
    //   $scope.saveEvent = null;
    //   return;
    // }

    // $scope.saveEvent = event;
    if (state.editedTodo) {
      state.editedTodo.title = state.editedTodo.title.trim();
      state.editedTodo = null;
    }

    // store[todo.title ? 'put' : 'delete'](todo)
    //   .then(function success() {}, function error() {
    //     todo.title = $scope.originalTodo.title;
    //   })
    //   .finally(function () {
    //     $scope.editedTodo = null;
    //   });
  }

  function revertEdits() {
    state.todos[state.todos.indexOf(state.editedTodo)] = state.originalTodo;
    state.editedTodo = null;
    state.originalTodo = null;
  }

  function removeTodo(todo) {
    state.todos.splice(state.todos.indexOf(todo), 1);
    updateCounts();
    // store.delete(todo);
  }

  function toggleCompleted(todo) {
    todo.completed = !todo.completed;
    updateCounts();
    // store.put(todo, todos.indexOf(todo))
    //   .then(function success() {}, function error() {
    //     todo.completed = !todo.completed;
    //   });
  }

  function clearCompletedTodos() {
    state.todos = state.todos.filter(function(todo) {
      return !todo.completed;
    });
    updateCounts();
    // store.clearCompleted();
  }

  function toggleAll() {
    state.allChecked = !state.allChecked;
    state.todos.forEach(function (todo) {
      todo.completed = state.allChecked;
    });
    updateCounts();
  }

  function updateCounts() {
    updateFilter();
    state.remainingCount = state.todos.filter(function(todo) {
      return !todo.completed;
    }).length;
    state.completedCount = state.todos.length - state.remainingCount;
    state.allChecked = state.remainingCount === 0;
  }

  function updateFilter(status) {
    if (status !== undefined) {
      state.status = status;
    }
    if (status === "active") {
      state.filteredTodos = state.todos.filter(function(todo) {
        return !todo.completed;
      });
    } else if (status === "completed") {
      state.filteredTodos = state.todos.filter(function(todo) {
        return todo.completed;
      });
    } else {
      state.filteredTodos = state.todos;
    }
  }
}
