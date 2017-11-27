class Util {

  getRouteParameters() {
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
  wrapFunction(functionToWrap, before, after, thisObject) {
    return function () {
      var args = Array.prototype.slice.call(arguments),
          result;
      if (before) before.apply(thisObject || this, args);
      result = functionToWrap.apply(thisObject || this, args);
      var isPromise = result && typeof result.then === 'function';
      if (after) {
        if (isPromise) {
          return Promise.resolve(result).then(function() {
            after.apply(thisObject || this, args);
          });
        } else {
          after.apply(thisObject || this, args);
        }
      }
      return result;
    }
  }

  wrapFunctions(functionsToWrap, before, after, thisObject) {
    var wrappedFunctions = {};
    for (var i in functionsToWrap) {
      wrappedFunctions[i] = this.wrapFunction(functionsToWrap[i], before, after, thisObject);
    }
    return wrappedFunctions;
  }

  getStoredItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  setStoredItem(key, value) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }
}

var util = new Util();
