const Route = require("../model/route");

const buildGraph = async () => {
  const routes = await Route.find({ blocked: false });

  const graph = {};

  routes.forEach((r) => {
    const from = r.from.toString();
    const to = r.to.toString();

    const cost =
      r.distance +
      r.time +
      r.fuelCost * r.traffic;
 
    if (!graph[from]) graph[from] = [];
    graph[from].push({
      node: to,
      cost
    });
 
  });

  return graph;
};

module.exports = { buildGraph };