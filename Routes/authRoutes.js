const Express = require("express");

const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  signInWithGoogleCredentials,
  updateUserProfileDetails,
  changePassword,
  userFeedback,
} = require("../Controllers/authControllers.js");
const validateToken = require("../middleware/validateToken.js");
const { route } = require("./postRoutes.js");

const router = Express.Router();

//feedback from user
router.post("/feedback", userFeedback);

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

//Update User Details
router.put("/updateProfile", validateToken, updateUserProfileDetails);

//Change Password
router.put("/changePassword", validateToken, changePassword);

// Sign-In with Google
router.post("/signin-with-google", signInWithGoogleCredentials);

module.exports = router;
