const express = require("express");
const router = express.Router();
const userRouter = require("./user.routes");
const logisticsRouter = require("./logistics.routes");
const analyticsRouter = require("./analytics.routes");
const hub = require("./hub.routes");


router.use("/user", userRouter);
router.use("/routes", logisticsRouter);
router.use("/analytics", analyticsRouter);
router.use("/hub", hub);
 


module.exports = router;