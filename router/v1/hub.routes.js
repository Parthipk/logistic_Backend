

const router = require("express").Router();
const { createHub } = require("../../controller/v1/hub.controller");
const { isUserAuthentication } = require("../../middleware/isUserAuthentication");
 const validate = require('../../middleware/validate'); 
const { hubZodSchema } = require("../../validators/validations");
 

router.post("/create",isUserAuthentication,validate(hubZodSchema), createHub);

module.exports = router;