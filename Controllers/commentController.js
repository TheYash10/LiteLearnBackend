const { Post, Comment } = require("../models");

const AddCommentOnPost = async (req, res) => {
  const { comment, commentId } = req.body;

  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
    });

    if (post) {
      const newComment = await Comment.create({
        id: commentId,
        comment,
        parentId: "-",
        commentedBy: req.userId,
        postId: req.params.postId,
      });

      if (newComment) {
        return res.status(200).json({
          status: true,
          message: "Thanks for your comment.",
          newComment,
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

  res.status(200).json({ comment, parentId });
};

const deleteCommentOnPost = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findOne({
      where: {
        id: commentId,
      },
    });

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
    }).then((val) => {
      res.status(200).json({
        status: true,
        message: "Comment deleted successfully.",
      });
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
};
