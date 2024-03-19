const { Post, User, Comment, UpvoteModel, Leaderboard } = require("../models");

const upvoteValue = 1;
const commentValue = 2;

// HELPER FUNCTIONS
const getUpvoteCount = async (postId) => {
  const { count, rows } = await UpvoteModel.findAndCountAll({
    where: {
      PostId: postId,
    },
  });

  return count;
};

const getCommentCount = async (postId) => {
  const { count, rows } = await Comment.findAndCountAll({
    where: {
      postId: postId,
      parentId: "-",
    },
  });

  return count;
};

const calculatePopularity = (totalUpvotes, totalComments) => {
  return upvoteValue * totalUpvotes + commentValue * totalComments;
};
// HELPER FUNCTIONS

const fetchleaderboardData = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findAll({
      order: [["popularity", "DESC"]],
    });

    const leaderboardData = await Promise.all(
      leaderboard.map(async (leaderData) => {
        const userData = await User.findOne({
          where: { id: leaderData.userId },
        });

        const { password, createdAt, updatedAt, id, ...reqUserData } =
          userData.dataValues;

        return {
          ...leaderData.dataValues,
          ...reqUserData,
        };
      })
    );

    res.status(200).json({
      status: true,
      leaderboardData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const fetchLeaderboardDataById = async (req, res) => {};

const generateLeaderboard = async (req, res) => {
  try {
    const allUserPosts = await Post.findAll();

    if (!allUserPosts) {
      return res.status(404).json({
        status: false,
        message: "Failed to fetch user posts",
      });
    }

    const leaderboardData = {};

    await Promise.all(
      allUserPosts.map(async (post) => {
        const upvoteCount = await getUpvoteCount(post.id);
        const commentCount = await getCommentCount(post.id);
        const popularity = calculatePopularity(upvoteCount, commentCount);

        if (leaderboardData[post.createdby]) {
          leaderboardData[post.createdby].totalComments += commentCount;
          leaderboardData[post.createdby].totalUpvotes += upvoteCount;
          leaderboardData[post.createdby].popularity += popularity;
        } else {
          leaderboardData[post.createdby] = {
            totalComments: 0,
            totalUpvotes: 0,
            popularity: 0,
          };

          leaderboardData[post.createdby].totalComments = commentCount;
          leaderboardData[post.createdby].totalUpvotes = upvoteCount;
          leaderboardData[post.createdby].popularity = popularity;
        }
      })
    );

    const leaderboardList = await Promise.all(
      Object.entries(leaderboardData).map(async ([userId, valueObj]) => {
        const existingCandidate = await Leaderboard.findOne({
          where: {
            userId,
          },
        });

        if (existingCandidate) {
          const updatedCandidate = await Leaderboard.update(
            {
              totalComments: valueObj.totalComments,
              totalUpvotes: valueObj.totalUpvotes,
              popularity: valueObj.popularity,
              userId,
            },
            { where: { userId } }
          );

          return updatedCandidate;
        }

        const newCandidate = await Leaderboard.create({
          totalComments: valueObj.totalComments,
          totalUpvotes: valueObj.totalUpvotes,
          popularity: valueObj.popularity,
          userId,
        });

        return newCandidate;
      })
    );

    res.status(200).json({
      output: leaderboardList,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateLeaderboardData = async (userId, commentCount, upvoteCount) => {
  const newPopularity = calculatePopularity(upvoteCount, commentCount);

  const existingCandidate = await Leaderboard.findOne({
    where: {
      userId,
    },
  });

  if (existingCandidate) {
    return await existingCandidate.update({
      totalComments: existingCandidate.totalComments + commentCount,
      totalUpvotes: existingCandidate.totalUpvotes + upvoteCount,
      popularity: existingCandidate.popularity + newPopularity,
    });
  }

  await Leaderboard.create({
    totalComments: commentCount,
    totalUpvotes: upvoteCount,
    popularity: newPopularity,
    userId,
  });
};

module.exports = {
  fetchleaderboardData,
  fetchLeaderboardDataById,
  generateLeaderboard,
  updateLeaderboardData,
};
