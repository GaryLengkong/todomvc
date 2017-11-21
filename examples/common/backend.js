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
