const mongoose = require("mongoose");
const Route = require("../../model/route");
const Hub = require("../../model/hub");
const { dijkstra } = require("../../services/dijkstra.service");


//@desc user get Optimal Route
//@api POST /getOptimalRoute
//@access Private

exports.getOptimalRoute = async (req, res, next) => {
    try {
        const { start, end } = req.body;

        if (!start || !end) {
            return res.status(400).json({ message: "Start and End required" });
        }

        const result = await dijkstra(start, end);

        if (!result.path || result.path.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No route found"
            });
        }

        const path = result.path.map(id => new mongoose.Types.ObjectId(id));

        const edges = await Route.aggregate([
            {
                $match: {
                    $or: [
                        { from: { $in: path }, to: { $in: path } }
                    ]
                }
            },
            {
                $project: {
                    from: 1,
                    to: 1,
                    fuelCost: 1,
                    traffic: 1
                }
            }
        ]);

        const edgeMap = new Map();

        edges.forEach(e => {
            const from = e.from.toString();
            const to = e.to.toString();

            edgeMap.set(`${from}-${to}`, e);
            edgeMap.set(`${to}-${from}`, e);
        });

        let totalFuel = 0;
        let totalTraffic = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i].toString();
            const to = path[i + 1].toString();

            const edge = edgeMap.get(`${from}-${to}`);

            if (edge) {
                totalFuel += edge.fuelCost || 0;
                totalTraffic += edge.traffic || 0;
            }
        }

        const orderMap = {};
        result.path.forEach((id, i) => {
            orderMap[id.toString()] = i;
        });

        const hubs = await Hub.find({
            _id: { $in: result.path }
        }).lean();

        const sorted = hubs.sort(
            (a, b) => orderMap[a._id.toString()] - orderMap[b._id.toString()]
        );

        return res.status(200).json({
            success: true,
            route: sorted,
            totalCost: result.cost,
            totalFuel,
            totalTraffic
        });

    } catch (err) {
        next(err);
    }
};


//@desc user update Traffic
//@api PUT /updateTraffic
//@access Private

exports.updateTraffic = async (req, res, next) => {
    try {
        const { routeId, traffic } = req.body;

        if (!routeId) {
            return res.status(400).json({ message: "Route ID required" });
        }

        const updated = await Route.findByIdAndUpdate(
            routeId,
            { traffic },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Route not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Traffic updated",
            route: updated
        });
    } catch (err) {
        next(err);
    }
};


//@desc user toggle Route
//@api PUT /toggleRoute
//@access Private

exports.toggleRoute = async (req, res, next) => {
    try {
        const { routeId, blocked } = req.body;

        const updated = await Route.findByIdAndUpdate(
            routeId,
            { blocked },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Route not found" });
        }

        return res.status(200).json({
            success: true,
            message: blocked ? "Route blocked" : "Route unblocked",
            route: updated
        });
    } catch (err) {
        next(err);
    }
};



//@desc user create Route
//@api POST /createRoute
//@access Private

exports.createRoute = async (req, res, next) => {
    try {
        const {
            from,
            to,
            distance,
            time,
            fuelCost,
            traffic
        } = req.body;
 

        const route = await Route.create({
            from,
            to,
            distance,
            time,
            fuelCost,
            traffic: traffic || 1,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Route created successfully",
            data: route
        });
    } catch (err) {
        next(err);
    }
};