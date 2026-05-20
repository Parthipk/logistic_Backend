
const { detectCycle } = require("../../services/cycle.service");
const { dijkstra } = require("../../services/dijkstra.service");
const { buildGraph } = require("../../services/graph.service");
const Route = require("../../model/route");
const Hub = require("../../model/hub");
const { errorResponse, successResponse } = require("../../helper/response");


//@desc user Cycle Checking
//@api POST /checkCycle
//@access Private

exports.checkCycle = async (req, res, next) => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
     return errorResponse(res, 400, "Start And End is required");
    }
    const hasCycle = await detectCycle(start, end);
    return res.status(200).json({
      success: true,
      hasCycle
    });
    
  } catch (err) {
    next(err);
  }
};


//@desc user top Fastest Routes
//@api POST /topFastestRoutes
//@access Private

 exports.topFastestRoutes = async (req, res, next) => {
  try {
    const { start, destinations } = req.body;

    if (!start || !destinations) {
      return errorResponse(res, 400, "Start And destinations is required");
    }

    const graph = await buildGraph();

    const startNode = start.toString();
    const results = [];

    const dfs = (node, target, visited, path, cost) => {
      if (node === target) {
        results.push({
          from: startNode,
          to: target,
          path: [...path],
          cost
        });
        return;
      }

      const neighbors = graph[node] || [];

      for (let nei of neighbors) {
        if (!visited.has(nei.node)) {
          visited.add(nei.node);

          dfs(
            nei.node,
            target,
            visited,
            [...path, nei.node],
            cost + nei.cost
          );

          visited.delete(nei.node);
        }
      }
    };

    for (let end of destinations) {
      dfs(
        startNode,
        end.toString(),
        new Set([startNode]),
        [startNode],
        0
      );
    }

    results.sort((a, b) => a.cost - b.cost);

    const top = results.slice(0, 5);

    const allIds = new Set();
    top.forEach(r => r.path.forEach(id => allIds.add(id)));

    const hubs = await Hub.find({
      _id: { $in: Array.from(allIds) }
    });

    const hubMap = {};
    hubs.forEach(h => {
      hubMap[h._id.toString()] = {
        id: h._id,
        name: h.name,
        code: h.code
      };
    });

    const enriched = top.map(r => ({
      ...r,
      path: r.path.map(id => hubMap[id] || id)
    }));

    return res.status(200).json({
      success: true,
      topRoutes: enriched
    });

  } catch (err) {
    next(err);
  }
};