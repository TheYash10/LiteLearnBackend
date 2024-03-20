const { User, Post, Comment } = require("../models");

const getRepliedToUser = async (userId) => {
  const userData = await User.findOne({
    where: {
      id: userId,
    },
  });

  return { username: userData.username };
};

const addReplyOnComment = async (req, res) => {
  const { reply, replyId, repliedToId, parentId } = req.body;
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
        message: "Such comment not found",
      });
    }

    const newReply = await Comment.create({
      comment: reply,
      commentId: replyId,
      parentId,
      repliedToId,
      commentedBy: req.userId,
      postId: learningId,
    });

    if (newReply) {
      const userData = await User.findOne({
        where: {
          id: req.userId,
        },
      });

      const repliedToUser = await getRepliedToUser(repliedToId);

      return res.status(200).json({
        status: true,
        message: "Replied Successfully.",
        newReply: {
          ...newReply.dataValues,
          replyByUsername: userData.username,
          replyByProfile: userData.profile,
          repliedTo: repliedToUser,
        },
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to add your reply, please try again",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteAllRelatedReplies = async (parentId) => {
  await Comment.destroy({
    where: {
      parentId,
    },
  });
};

const deleteReplyOnComment = async (req, res) => {
  const replyId = req.params.replyId;

  try {
    const comment = await Comment.findOne({
      where: {
        id: replyId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Such reply not found!",
      });
    }

    if (comment.commentedBy !== req.userId) {
      return res.status(400).json({
        status: false,
        message: "You are not authorized to delete these reply!",
      });
    }

    await Comment.destroy({
      where: {
        id: replyId,
      },
    }).then(async (val) => {
      await deleteAllRelatedReplies(replyId);

      res.status(200).json({
        status: true,
        message: "Reply deleted successfully.",
        replyId,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getRepliesByCommentId = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        parentId: commentId,
      },
      order: [["createdAt", "ASC"]],
    });

    let formatedListOfReplies;
    if (rows.length !== 0) {
      formatedListOfReplies = await Promise.all(
        rows.map(async (reply) => {
          const userData = await User.findOne({
            where: {
              id: reply.commentedBy,
            },
          });

          const repliedToUser = await getRepliedToUser(reply.repliedToId);

          return {
            ...reply.dataValues,
            replyByUsername: userData.username,
            replyByProfile: userData.profile,
            repliedTo: repliedToUser,
          };
        })
      );
    } else {
      formatedListOfReplies = [];
    }

    res.status(200).json({
      status: true,
      replies: formatedListOfReplies,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReplyOnComment,
  deleteReplyOnComment,
  getRepliesByCommentId,
};
