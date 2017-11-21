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

function getController(state, handlers, before, after) {
  // Call update to get computed states and set view states
  if (after) {
    after();
  }

  return {
    state: state,
    handlers: wrapFunctions(handlers, before, after, null)
  };
}

function getItemFromStore(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

function setItemInStore(key, value) {
  return sessionStorage.setItem(key, JSON.stringify(value));
}
