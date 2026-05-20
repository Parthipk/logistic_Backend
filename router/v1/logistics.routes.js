const express = require('express');
const router = express.Router();

const { getOptimalRoute, updateTraffic, toggleRoute, createRoute } = require('../../controller/v1/route.controller');
const { isUserAuthentication } = require('../../middleware/isUserAuthentication');
const validate = require('../../middleware/validate');
const { createRouteZodSchema } = require('../../validators/validations');



router.post("/create", isUserAuthentication,validate(createRouteZodSchema), createRoute);


router.post("/optimize", isUserAuthentication, getOptimalRoute);
router.put("/traffic", isUserAuthentication, updateTraffic);
router.put("/block", isUserAuthentication, toggleRoute);

module.exports = router;