const router = require("express").Router();
const { checkCycle, topFastestRoutes } = require("../../controller/v1/analytics.controller");
const { isUserAuthentication } = require("../../middleware/isUserAuthentication");



router.post("/cycle", isUserAuthentication, checkCycle);
router.post("/top-routes", isUserAuthentication, topFastestRoutes);

module.exports = router;