const { Post, Comment } = require("../models");

const User = require("../models").User;

const { UpvoteModel } = require("../models");

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
          message: "User is not Authorized",
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
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (req.userId === postData.createdby) {
      if (postData) {
        const deletedPost = await Post.destroy({
          where: {
            id: req.params.id,
          },
        });

        if (deletedPost) {
          res.status(200).json({
            status: true,
            message: "Learning Deleted Successfully",
          });
        } else {
          res.status(500).json({
            status: false,
            message: "Failed to update learning",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "Learning not found",
        });
      }
    } else {
      res.status(401).json({
        status: false,
        message: "User is not authorized",
      });
    }
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
    if (rows.length !== 0) {
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

module.exports = {
  createPost,
  updatePost,
  deletePost,
  allPosts,
  userPosts,
  upvotePost,
  getPostByTag,
};
