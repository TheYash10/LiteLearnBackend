const { Post, Comment, User } = require("../models");
const { updateLeaderboardData } = require("./leaderboardController");

const AddCommentOnPost = async (req, res) => {
  const { comment, commentId } = req.body;
  const learningId = req.params.learningId;

  try {
    const post = await Post.findOne({
      where: {
        id: learningId,
      },
    });

    if (post) {
      const newComment = await Comment.create({
        id: commentId,
        comment,
        commentedBy: req.userId,
        postId: learningId,
      });

      await updateLeaderboardData(post.createdby, 1, 0);

      if (newComment) {
        const userData = await User.findOne({
          where: {
            id: newComment.commentedBy,
          },
        });

        return res.status(200).json({
          status: true,
          message: "Thanks for your comment.",
          newComment: {
            ...newComment.dataValues,
            commentByUsername: userData.username,
            commentByProfile: userData.profile,
          },
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Failed to add your comment, please try again",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: `Such learning not found`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteAllRelatedReplies = async (parentId, res) => {
  await Comment.destroy({
    where: {
      parentId,
    },
  });
};

const deleteCommentOnPost = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findOne({
      where: {
        id: commentId,
      },
    });

    const post = await Post.findOne({
      where: { id: comment.postId },
    });

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "No such post found.",
      });
    }

    if (comment === null) {
      return res.status(404).json({
        status: false,
        message: "Such comment not found!",
      });
    }

    if (comment.commentedBy !== req.userId) {
      return res.status(400).json({
        status: false,
        message: "You are not authorized to delete these comment!",
      });
    }

    await Comment.destroy({
      where: {
        id: commentId,
      },
    }).then(async (val) => {
      await deleteAllRelatedReplies(commentId);

      await updateLeaderboardData(post.createdby, -1, 0);

      res.status(200).json({
        status: true,
        message: "Comment deleted successfully.",
        commentId,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getCommentsByPostId = async (req, res) => {
  const learningId = req.params.learningId;

  try {
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        postId: learningId,
        repliedToId: "-",
      },
      order: [["createdAt", "DESC"]],
    });

    let formatedListOfComments;
    if (rows.length !== 0) {
      formatedListOfComments = await Promise.all(
        rows.map(async (comment) => {
          const userData = await User.findOne({
            where: {
              id: comment.commentedBy,
            },
          });

          return {
            ...comment.dataValues,
            commentByUsername: userData.username,
            commentByProfile: userData.profile,
          };
        })
      );
    } else {
      formatedListOfComments = [];
    }

    res.status(200).json({
      status: true,
      comments: formatedListOfComments,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddCommentOnPost,
  deleteCommentOnPost,
  getCommentsByPostId,
};
