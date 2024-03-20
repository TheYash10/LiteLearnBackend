const {
  addNewFeedback,
  deleteFeedback,
  getAllFeedbacks,
} = require("../Controllers/feedbackController");

const Express = require("express");
const validateToken = require("../middleware/validateToken");

const router = Express.Router();

router.post("/addFeedback", validateToken, addNewFeedback);

router.get("/", validateToken, getAllFeedbacks);

router.delete("/:id", validateToken, deleteFeedback);

module.exports = router;
