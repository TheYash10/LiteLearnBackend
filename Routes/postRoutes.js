const Express = require('express')

const validateToken = require('../middleware/validateToken')
const router = Express.Router();
const { createPost, updatePost } = require('../Controllers/postControllers')

router.use(validateToken)
router.post("/create", createPost)

router.put("/:id/update", updatePost)


module.exports = router