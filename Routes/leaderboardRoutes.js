const Express = require("express");
const {
  generateLeaderboard,
  fetchleaderboardData,
  fetchLeaderboardDataById,
} = require("../Controllers/leaderboardController");
const validateToken = require("../middleware/validateToken.js");

const router = Express.Router();

router.get("/", validateToken, fetchleaderboardData);

router.get("/:id", validateToken, fetchLeaderboardDataById);

router.get("/generate", generateLeaderboard);

module.exports = router;
