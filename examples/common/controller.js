/**
 * Returns an object containing the state and handlers
 * to be connected to the view. Update will be called
 * after every call to each function in the handlers.
 */
function todoController(update) {

  var state = {
    filter: "all",
    todos: [],
    filteredTodos: [],
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

  function addTodo(title) {
    if (title) {
      var newTodo = {
        title: title.trim(),
        completed: false,
        editing: false
      };
      state.todos.push(newTodo);
      updateCounts();
    }

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
    todo.editing = true;
  }

  function saveEdits(todo, editedTodo) {
    // For now only handle submit events
    // // Blur events are automatically triggered after the form submit event.
    // // This does some unfortunate logic handling to prevent saving twice.
    // if (event === 'blur' && $scope.saveEvent === 'submit') {
    //   $scope.saveEvent = null;
    //   return;
    // }

    // $scope.saveEvent = event;
    if (todo.editing) {
      todo.title = editedTodo.trim();
      todo.editing = false;
    }

    // store[todo.title ? 'put' : 'delete'](todo)
    //   .then(function success() {}, function error() {
    //     todo.title = $scope.originalTodo.title;
    //   })
    //   .finally(function () {
    //     $scope.editedTodo = null;
    //   });
  }

  function revertEdits(todo) {
    todo.editing = false;
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

  function updateFilter(filter) {
    if (filter !== undefined) {
      state.filter = filter;
    }
    if (filter === "active") {
      state.filteredTodos = state.todos.filter(function(todo) {
        return !todo.completed;
      });
    } else if (filter === "completed") {
      state.filteredTodos = state.todos.filter(function(todo) {
        return todo.completed;
      });
    } else {
      state.filteredTodos = state.todos;
    }
  }
}
