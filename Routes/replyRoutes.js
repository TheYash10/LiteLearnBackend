const Express = require("express");
const validateToken = require("../middleware/validateToken");
const {
  addReplyOnComment,
  deleteReplyOnComment,
  getRepliesByCommentId,
} = require("../Controllers/replyControllers");

const router = Express.Router();

router.post("/:learningId", validateToken, addReplyOnComment);
router.delete("/:replyId/delete", validateToken, deleteReplyOnComment);
router.get("/:commentId", validateToken, getRepliesByCommentId);

module.exports = router;
