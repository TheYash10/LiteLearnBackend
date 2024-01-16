const Express = require('express')

const {registerUser,loginUser,currentUser} = require("../Controllers/authControllers.js");
const validateToken = require('../middleware/validateToken.js');

const router = Express.Router();

// Register a User
router.post('/register',registerUser);

// Login a user
router.post('/login',loginUser)

// current user
router.get('/current',validateToken,currentUser)

module.exports=router