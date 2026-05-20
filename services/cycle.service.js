const Route = require("../model/route");

const detectCycle = async () => {
  const routes = await Route.find({});

  const graph = {};
 
  for (let r of routes) {
    if (!graph[r.from]) graph[r.from] = [];
    graph[r.from].push(r.to);
  }

  const visited = new Set();
  const recStack = new Set();

  const dfs = (node) => {
    if (recStack.has(node)) return true;  
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (let nei of (graph[node] || [])) {
      if (dfs(nei)) return true;
    }

    recStack.delete(node);
    return false;
  };

  for (let node in graph) {
    if (dfs(node)) return true;
  }

  return false;
};

module.exports = { detectCycle };