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
} = require("../Controllers/postControllers");

router.use(validateToken);
router.post("/create", createPost);

router.put("/:id/update", updatePost);

router.delete("/:id/delete", deletePost);

router.get("/allPosts", allPosts);

router.get("/:id/allPosts", userPosts);

router.post("/:id/upvote", upvotePost);

module.exports = router;
