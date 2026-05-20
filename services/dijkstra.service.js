const { buildGraph } = require("./graph.service");

const dijkstra = async (start, end) => {
  const graph = await buildGraph();

  const dist = {};
  const prev = {};
  const visited = new Set();

  const nodes = new Set([
    ...Object.keys(graph),
    start.toString(),
    end.toString()
  ]);
 
  nodes.forEach((n) => {
    dist[n] = Infinity;
  });

  start = start.toString();
  end = end.toString();

  if (!graph[start]) {
    return { path: [], cost: Infinity };
  }

  dist[start] = 0;

  while (true) {
    let closest = null;

    for (let node in dist) {
      if (!visited.has(node)) {
        if (closest === null || dist[node] < dist[closest]) {
          closest = node;
        }
      }
    }

    if (closest === null) break;

    visited.add(closest);

    graph[closest]?.forEach((nei) => {
      const newDist = dist[closest] + nei.cost;

      if (newDist < dist[nei.node]) {
        dist[nei.node] = newDist;
        prev[nei.node] = closest;
      }
    });
  }
 
  const path = [];
  let curr = end;

  if (dist[end] === Infinity) {
    return { path: [], cost: Infinity };
  }

  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    path,
    cost: dist[end]
  };
};

module.exports = { dijkstra };