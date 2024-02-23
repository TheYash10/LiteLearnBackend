const { Post, Comment, User } = require("../models");

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
        parentId: "-",
        commentedBy: req.userId,
        postId: learningId,
      });

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
      },
      order: [["createdAt", "DESC"]],
    });

    console.log("ROWS : ", rows);

    let formatedListOfComments;
    if (rows.length !== 0) {
      formatedListOfComments = await Promise.all(
        rows.map(async (comment) => {
          const userData = await User.findOne({
            where: {
              id: comment.commentedBy,
            },
          });

          comment.commentByUsername = userData.username;
          comment.commentByProfile = userData.profile;

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

const addReplyOnComment = async (req, res) => {
  const { reply, replyId, parentId } = req.body;
  const learningId = req.params.learningId;

  try {
    const comment = await Comment.findOne({
      where: {
        id: parentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Such comment not found!",
      });
    }

    const post = await Post.findOne({
      where: {
        id: learningId,
      },
    });

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Such learning not found!",
      });
    }

    const newReply = await Comment.create({
      id: replyId,
      comment: reply,
      parentId,
      commentedBy: req.userId,
      postId: learningId,
    });

    if (newReply) {
      const userData = await User.findOne({
        where: {},
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
  AddCommentOnPost,
  deleteCommentOnPost,
  getCommentsByPostId,
};
