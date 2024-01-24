const Express = require("express");

const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  signInWithGoogleCredentials,
} = require("../Controllers/authControllers.js");
const validateToken = require("../middleware/validateToken.js");

const router = Express.Router();

// Register a User
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// current user
router.get("/current", validateToken, currentUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Sign-In with Google
router.post("/signin-with-google", signInWithGoogleCredentials);


module.exports = router;
