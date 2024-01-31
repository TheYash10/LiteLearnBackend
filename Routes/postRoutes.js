const Express = require('express')

const validateToken = require('../middleware/validateToken')
const router = Express.Router();
const { createPost, updatePost, deletePost, allPosts, userPosts, upvotePost, getPostByTag } = require('../Controllers/postControllers')

router.use(validateToken)
router.post("/create", createPost)

router.put("/:id/update", updatePost)

router.delete("/:id/delete", deletePost)

router.get("/allPosts/:page", allPosts)

router.get("/:id/allPosts/:page", userPosts)

router.post("/:id/upvote", upvotePost);

router.get("/allPosts/:page/:tag", getPostByTag)

module.exports = router