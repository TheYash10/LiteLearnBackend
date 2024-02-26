const Express = require("express");
const validateToken = require("../middleware/validateToken");
const {
  AddCommentOnPost,
  deleteCommentOnPost,
  getCommentsByPostId,
} = require("../Controllers/commentController");
const router = Express.Router();

router.post("/:learningId", validateToken, AddCommentOnPost);
router.delete("/:commentId/delete", validateToken, deleteCommentOnPost);
router.get("/:learningId", validateToken, getCommentsByPostId);

router;

module.exports = router;
