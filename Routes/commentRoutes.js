const Express = require("express");
const validateToken = require("../middleware/validateToken");
const {
  AddCommentOnPost,
  deleteCommentOnPost,
} = require("../Controllers/commentController");
const router = Express.Router();

router.post("/:postId", validateToken, AddCommentOnPost);
router.delete("/:commentId/delete", validateToken, deleteCommentOnPost);

module.exports = router;
