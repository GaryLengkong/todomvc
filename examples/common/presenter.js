class Presenter {
  constructor(routeParameters, getViewState, setViewState) {
    this.routeParameters = routeParameters
    this.getViewState = getViewState
    this.setViewState = setViewState
    let storedState = this.getStoredState()
    if (storedState) {
      this.state = storedState
    }
    if (!this.routeParameters) {
      this.routeParameters = util.getRouteParameters();
    }
  }

  set loaders(loaders) {
    for (let loader of loaders) {
      this[loader.name] = util.wrapFunction(loader, null, this.after, this);
    }
  }

  set handlers(handlers) {
    this._handlers = handlers;
  }

  get handlers() {
    let handlers = {}
    for (let handler of this._handlers) {
      handlers[handler.name] = handler
    }
    return util.wrapFunctions(handlers, this.before, this.after, this)
  }


  before() {
    if (this.getViewState) {
      this.state = this.getViewState();
    }
  }

  after() {
    this.updateComputedState();
    this.updateStoredState();
    if (this.setViewState) {
      this.setViewState(this.state);
    }
  }

  updateComputedState() {
  }

  updateStoredState() {
    return util.setStoredItem(this.constructor.name, this.state);
  }

  getStoredState() {
    return util.getStoredItem(this.constructor.name);
  }
}
