const Express = require("express");

const validateToken = require("../middleware/validateToken");
const router = Express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  allPosts,
  userPosts,
  upvotePost,
  getPostByTag,
} = require("../Controllers/postControllers");

router.use(validateToken);
router.post("/create", createPost);

router.put("/:id/update", updatePost);

router.delete("/:id/delete", validateToken, deletePost);

router.get("/all/:page", allPosts);

router.get("/:id/allPosts/:page", userPosts);

router.put("/:id/upvote", upvotePost);

router.get("/:tag/:page", getPostByTag);

module.exports = router;
