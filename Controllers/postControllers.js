const { Post, Comment, Bookmark, Feedback } = require("../models");

const User = require("../models").User;

const { UpvoteModel } = require("../models");
const { updateLeaderboardData } = require("./leaderboardController");

// Create New Post

const createPost = async (req, res) => {
  const { filetype, attachment, tag, domain, note, id } = req.body;

  try {
    const newPost = await Post.create({
      id,
      filetype,
      attachment,
      tag,
      domain,
      note,
      createdby: req.userId,
    });

    // Retrieve user details for the response
    const user = await User.findOne({
      where: { id: req.userId },
    });

    res.status(200).json({
      status: true,
      message: "Learning Created Successfully!",
      postDetails: newPost,
      userDetails: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
      upvote: [],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (postData) {
      if (req.userId === postData.createdby) {
        const updatedPost = await Post.update(
          {
            filetype: req.body.filetype,
            attachment: req.body.attachment,
            tag: req.body.tag,
            domain: req.body.domain,
            note: req.body.note,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );

        if (updatedPost) {
          res.status(200).json({
            status: true,
            message: "Learning Updated Successfully",
          });
        } else {
          res.status(500).json({
            status: false,
            message: "Failed to update learning",
          });
        }
      } else {
        res.status(401).json({
          status: false,
          message: "You'r not authorized to updated this learning!",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Learning not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update learning",
    });
  }
};

const allPosts = async (req, res) => {
  const page = req.params.page || 1; // Page number, default to 1
  const pageSize = 10; // Number of posts per page

  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
    if (rows.length !== 0) {
      const postsWithUpvotes = await Promise.all(
        rows.map(async (post) => {
          const ListOfUpvotes = await UpvoteModel.findAll({
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

          var listOfUserIdUpvote = ListOfUpvotes.map((item) => {
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
        totalPages: Math.ceil(count / pageSize),
        message: "List of All learnings",
        Posts: postsWithUpvotes,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Learning not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const userPosts = async (req, res) => {
  const page = req.params.page || 1; // Page number, default to 1
  const pageSize = 10; // Number of posts per page
  try {
    const offset = (page - 1) * pageSize;
    const posts = await Post.findAll({
      limit: pageSize,
      offset: offset,
      order: [["createdat", "DESC"]],
      where: {
        createdby: req.params.id,
      },
    });

    if (posts.length !== 0) {
      const postsWithUpvotes = await Promise.all(
        posts.map(async (post) => {
          const ListOfUpvotes = await UpvoteModel.findAll({
            where: {
              postid: post.id,
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
          var listOfUserIdUpvote = ListOfUpvotes.map((item) => {
            return item["UserId"];
          });
          return {
            ...post.toJSON(),
            listOfUserIdUpvote,
            userDetails,
          };
        })
      );
      res.status(200).json({
        status: true,
        message: "List of All Learnings",
        Posts: postsWithUpvotes,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Learning not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const learningToDelete = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!learningToDelete) {
      return res.status(404).json({
        status: false,
        message: "Such learning not found.",
      });
    }

    if (userId !== learningToDelete.createdby) {
      return res.status(401).json({
        status: false,
        message: "You'r not authorized to delete this learning!",
      });
    }

    await Comment.destroy({
      where: {
        postId: learningToDelete.id,
      },
    }).then(async () => {
      await Post.destroy({
        where: {
          id: learningToDelete.id,
        },
      }).then(() => {
        return res.status(200).json({
          status: true,
          message: "Learning deleted successfully.",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const upvotePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "No such post found.",
      });
    }

    const findId = await UpvoteModel.findOne({
      where: {
        UserId: req.userId,
        PostId: postId,
      },
    });

    if (findId) {
      const response = await UpvoteModel.destroy({
        where: {
          UserId: req.userId,
          PostId: postId,
        },
      });

      if (response) {
        res.status(200).json({
          status: true,
          message: "Upvote Deleted Successfully!",
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Can't able to perform destroy query",
        });
      }
    } else {
      const response = await UpvoteModel.create({
        UserId: req.userId,
        PostId: postId,
      });

      await updateLeaderboardData(post.createdby, 0, 1);

      if (response) {
        res.status(200).json({
          status: true,
          message: "Upvote Added Successfully!",
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Can't able to perform destroy query",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to upvote",
    });
  }
};

const getPostByTag = async (req, res) => {
  let tag = req.params.tag;
  const page = req.params.page || 1; // Page number, default to 1
  const pageSize = 10; // Number of posts per page
  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Post.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["createdat", "DESC"]],
      where: {
        tag: tag,
      },
    });
    if (rows.length > 0) {
      const postsWithUpvotes = await Promise.all(
        rows.map(async (post) => {
          const ListOfUpvotes = await UpvoteModel.findAll({
            where: {
              postid: post.id,
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
          var listOfUserIdUpvote = ListOfUpvotes.map((item) => {
            return item["UserId"];
          });
          return {
            ...post.toJSON(),
            upvotes: listOfUserIdUpvote,
            userDetails,
          };
        })
      );
      res.status(200).json({
        status: true,
        totalPages: Math.ceil(count / pageSize),
        message: "List of All Learnings",
        Posts: postsWithUpvotes,
      });
    } else {
      res.status(200).json({
        status: false,
        message: `Didn't find learning for "@${tag.toUpperCase()}"`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const bookmarkLearning = async (req, res) => {
  const { learningId, userId } = req.body;
  try {
    const existingBookmark = await Bookmark.findOne({
      where: {
        bookmark: learningId,
        bookmarkedBy: userId,
      },
    });

    if (existingBookmark) {
      await existingBookmark.destroy().then(() => {
        return res.status(200).json({
          status: true,
          message: "Learning removed from bookmarks",
        });
      });
    }

    const newBookmark = await Bookmark.create({
      bookmark: learningId,
      bookmarkedBy: userId,
    });

    if (newBookmark) {
      const { createdAt, updatedAt, ...rest } = newBookmark;

      res.status(200).json({
        status: true,
        message: "Learning added to bookmarks",
        newBookmark,
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
        userId,
      },
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
  const { bookmarkId } = req.body;
  try {
    const existingBookmark = await Bookmark.findOne({
      where: { id: bookmarkId },
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

module.exports = {
  createPost,
  updatePost,
  deletePost,
  allPosts,
  userPosts,
  upvotePost,
  getPostByTag,
  bookmarkLearning,
  fetchAllBookmarks,
  clearAllBookmarks,
  clearBookmarkById,
};
