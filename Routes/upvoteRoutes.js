const express = require("express");
const { upvotePost } = require("../Controllers/upvoteControllers");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.use(validateToken);

router.post("/:id/upvote", upvotePost);

module.exports = router;
