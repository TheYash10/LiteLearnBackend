const Express = require("express");
const {
  addBookmark,
  fetchAllBookmarks,
  clearAllBookmarks,
  clearBookmarkById,
  fetchBookmarkedLearning,
} = require("../Controllers/bookmarkController");
const validateToken = require("../middleware/validateToken");

const router = Express.Router();

router.post("/addBookmark", validateToken, addBookmark);

router.get("/getBookmarks", validateToken, fetchAllBookmarks);

router.get("/all/:page", validateToken, fetchBookmarkedLearning);

router.delete("/clearAllBookmarks", validateToken, clearAllBookmarks);

router.delete("removeBookmark", validateToken, clearBookmarkById);

module.exports = router;
