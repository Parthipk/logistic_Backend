const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hub"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hub"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
    },

    distance: Number,
    time: Number,
    fuelCost: Number,
    traffic: {
        type: Number,
        default: 1
    },
    blocked: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);