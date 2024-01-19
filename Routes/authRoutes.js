const Express = require('express')

const {registerUser,loginUser,currentUser,forgotPassword,resetPassword} = require("../Controllers/authControllers.js");
const validateToken = require('../middleware/validateToken.js');

const router = Express.Router();

// Register a User
router.post('/register',registerUser);

// Login a user
router.post('/login',loginUser)

// current user
router.get('/current',validateToken,currentUser)

// Forgot password
router.post('/forgot-password',forgotPassword)

router.post('/reset-password',resetPassword)

module.exports=router