const express = require('express');
const router = express.Router();
 
const { signup, login } = require('../../controller/v1/user.controller');
const { isUserAuthentication } = require('../../middleware/isUserAuthentication');
const validate = require('../../middleware/validate'); 
const { userValidationSchema } = require('../../validators/userValidation');


  
// auth
router.post('/signUp', validate(userValidationSchema), signup)
router.post('/logIn',login)



module.exports = router;
