const { Bookmark, Post, UpvoteModel, User, Comment } = require("../models");

const addBookmark = async (req, res) => {
  const { id, learningId, userId } = req.body;
  try {
    const existingBookmark = await Bookmark.findOne({
      where: {
        bookmark: learningId,
        bookmarkedBy: userId,
      },
    });

    if (existingBookmark) {
      await existingBookmark.destroy();
      return res.status(200).json({
        status: true,
        message: "Learning removed from bookmarks",
      });
    }

    const newBookmark = await Bookmark.create({
      id,
      bookmark: learningId,
      bookmarkedBy: userId,
    });

    if (newBookmark) {
      const { createdAt, updatedAt, ...rest } = newBookmark;

      res.status(200).json({
        status: true,
        message: "Learning added to bookmarks",
        newBookmark: rest,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const fetchAllBookmarks = async (req, res) => {
  const userId = req.userId;
  try {
    const { count, rows } = await Bookmark.findAndCountAll({
      where: {
        bookmarkedBy: userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "bookmarkedBy"] },
    });

    res.status(200).json({
      status: true,
      count,
      bookmarks: rows,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const clearAllBookmarks = async (req, res) => {
  const userId = req.userId;
  try {
    const allBookmarksDeleted = await Bookmark.destroy({
      where: {
        userId,
      },
    });

    if (!allBookmarksDeleted) {
      return res.status(204).json({
        status: false,
        message: "Failed to clear bookmarks. Try again later",
      });
    }

    res.status(200).json({
      status: true,
      message: "All bookmarks cleared successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const clearBookmarkById = async (req, res) => {
  const { learningId, userId } = req.body;

  try {
    const existingBookmark = await Bookmark.findOne({
      where: {
        bookmark: learningId,
        bookmarkedBy: userId,
      },
    });

    if (!existingBookmark) {
      return res.status(404).json({
        status: false,
        message: "Bookmark not found.",
      });
    }

    await existingBookmark.destroy().then(() => {
      return res.status(200).json({
        status: true,
        message: "Bookmark removed successfully",
      });
    });

    res.status(204).json({
      status: false,
      message: "Failed to remove bookmark",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const fetchBookmarkedLearning = async (req, res) => {
  try {
    const userId = req.userId;
    const page = req.params.page || 1; // Page number, default to 1
    const pageSize = 10; // Number of posts per page

    const offset = (page - 1) * pageSize;
    const { count, rows } = await Bookmark.findAndCountAll({
      where: {
        bookmarkedBy: userId,
      },
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    if (count > 0) {
      const bookmarkedLearningList = await Promise.all(
        rows.map(async (bookmarkItem) => {
          const post = await Post.findOne({
            where: {
              id: bookmarkItem.bookmark,
            },
          });

          const listOfUpvotes = await UpvoteModel.findAll({
            where: {
              postId: post.id,
            },
          });

          const { count, rows } = await Comment.findAndCountAll({
            where: {
              postId: post.id,
              repliedToId: "-",
            },
          });

          const data = await User.findOne({
            where: {
              id: post.createdby,
            },
          });

          const userDetails = {
            username: data.username,
            id: data.id,
            profile: data.profile,
          };

          const listOfUserIdUpvote = listOfUpvotes.map((item) => {
            return item["UserId"];
          });

          return {
            ...post.toJSON(),
            upvotes: listOfUserIdUpvote,
            userDetails,
            commentCount: count,
          };
        })
      );

      res.status(200).json({
        status: true,
        message: "List of all bookmarked learnings",
        Posts: bookmarkedLearningList,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Bookmarked learning not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  addBookmark,
  clearAllBookmarks,
  fetchAllBookmarks,
  clearBookmarkById,
  fetchBookmarkedLearning,
};
