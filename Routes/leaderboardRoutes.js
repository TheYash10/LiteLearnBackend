const Express = require("express");
const {
  generateLeaderboard,
  fetchleaderboardData,
  fetchLeaderboardDataById,
} = require("../Controllers/leaderboardController");

const router = Express.Router();

router.get("/", fetchleaderboardData);

router.get("/:id", fetchLeaderboardDataById);

router.get("/generate", generateLeaderboard);

module.exports = router;
