const { Post } = require("../models");

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
      message: "Post Created Successfully!",
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
    const postData = Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (postData) {
      const updatedPost = Post.update(
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
          message: "Post Updated Successfully",
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Failed to update Post",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const allPosts = async (req, res) => {
  const page = req.query.page || 1; // Page number, default to 1
  const pageSize = 10; // Number of posts per page

  try {
    const offset = (page - 1) * pageSize;
    const posts = await Post.findAll({
      limit: pageSize,
      offset: offset,
      order: [["createdat", "DESC"]],
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
        message: "List of All Posts",
        Posts: postsWithUpvotes,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Post not found",
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
  const page = req.query.page || 1; // Page number, default to 1
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
        message: "List of All Posts",
        Posts: postsWithUpvotes,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Post not found",
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

    if (postData) {
      const deletedPost = await Post.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (deletedPost) {
        res.status(200).json({
          status: true,
          message: "Post Deleted Successfully",
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Failed to update Post",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createPost, updatePost, deletePost, allPosts, userPosts };
