const CONSTANTS = {
  NAME_URL_PARAM : 'name',
  STORE_KEY : 'todo',
  ALL_TODOS : 'all',
  ACTIVE_TODOS : 'active',
  COMPLETED_TODOS : 'completed'
}

const INITIAL_STATE = {
  ...CONSTANTS,
  filter: CONSTANTS.ALL_TODOS,
  todos: [],
  editedTodo: null,
  filteredTodos: [],
  remainingCount: 0,
  completedCount: 0,
  newTodo: '',
  isAllCompleted: false,
  originalTodo: '',
  isLoaded: true
}

class TodoPresenter extends Presenter {

  constructor(routeParameters, getViewState, setViewState) {
    super(routeParameters, getViewState, setViewState)
    if (!this.state) {
      this.state = INITIAL_STATE
    }
    this.handlers = [
      this.addTodo,
      this.editTodo,
      this.saveEdits,
      this.revertEdits,
      this.removeTodo,
      this.toggleCompleted,
      this.clearCompletedTodos,
      this.toggleAll,
      this.setFilter,
      this.setEditedTodo,
      this.setNewTodo
    ]
    this.loaders = [
      this.loadTodos,
      this.loadData
    ]
    this.activate()
  }

  activate() {

    var todosName = this.routeParameters[CONSTANTS.NAME_URL_PARAM];
    if (todosName) {
      // Load model data from backend (no ui state)
      this.loadTodos(todosName);
    }

    // Do this after loading state from store
    this.setFilter(this.routeParameters.filter);

    // Load dynamic data (that will not be saved)
    this.loadData();
  }

  loadTodos(todosName) {
    this.state.isLoaded = false;
    // Populate state based on data from backend
    return backend.getTodos(todosName).then((todos) => {
      this.state.todos = todos;
      this.state.isLoaded = true;
    });
  }

  // Load dynamic data, e.g. list of available pools
  loadData() {
    return backend.getInfo().then((info) => {
      this.state.info = info;
    });
  }

  getNewTodoId() {
    return this.state.todos.reduce((id, todo) => {
      return Math.max(id, todo.id)
    }, 0) + 1;
  }

  addTodo() {
    if (this.state.newTodo) {
      var newTodo = {
        text: this.state.newTodo.trim(),
        completed: false,
        id: this.getNewTodoId()
      };
      this.state.todos.push(newTodo);
      this.state.newTodo = '';
    }
  }

  editTodo(todo) {
    this.state.editedTodo = todo;
    this.state.originalTodo = todo.text;
  }

  saveEdits(todo) {
    if (!this.state.editedTodo) {
      return;
    }
    todo.text = this.state.editedTodo.text.trim();
    this.state.editedTodo = null;
    this.state.originalTodo = '';
  }

  revertEdits(todo) {
    todo.text = this.state.originalTodo;
    this.state.editedTodo = null;
    this.state.originalTodo = '';
  }

  removeTodo(todo) {
    this.state.todos.splice(this.state.todos.indexOf(todo), 1);
  }

  toggleCompleted(todo) {
    todo.completed = !todo.completed;
  }

  clearCompletedTodos() {
    this.state.todos = this.state.todos.filter((todo) => {
      return !todo.completed;
    });
  }

  toggleAll() {
    this.state.isAllCompleted = !this.state.isAllCompleted;
    this.state.todos.forEach((todo) => {
      todo.completed = this.state.isAllCompleted;
    });
  }

  setFilter(filter) {
    this.state.filter = filter;
  }

  // Methods only used by react

  setNewTodo(value) {
    this.state.newTodo = value;
  }

  setEditedTodo(value) {
    this.state.editedTodo.text = value;
  }

  updateComputedState() {
    var completed = this.state.todos.filter((todo) => {
      return todo.completed;
    });
    var remaining = this.state.todos.filter((todo) => {
      return !todo.completed;
    });
    this.state.remainingCount = remaining.length;
    this.state.completedCount = completed.length;
    this.state.isAllCompleted = this.state.remainingCount === 0;
    this.state.isAllFiltered = !this.state.filter || this.state.filter === CONSTANTS.ALL_TODOS;
    this.state.isActiveFiltered = this.state.filter === CONSTANTS.ACTIVE_TODOS;
    this.state.isCompletedFiltered = this.state.filter === CONSTANTS.COMPLETED_TODOS;
    this.state.filteredTodos = this.state.isAllFiltered ? this.state.todos : this.state.isCompletedFiltered ? completed : remaining;
  }

}
