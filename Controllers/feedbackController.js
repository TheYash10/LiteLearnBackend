const { Feedback } = require("../models");

const addNewFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const userId = req.userId;

    const newFeedback = await Feedback.create({
      feedback,
      feedbackBy: userId,
    });

    if (newFeedback) {
      return res.status(200).json({
        status: true,
        message: "Thanks for your valuable feedback. We will work on it.",
      });
    }

    res.status(304).json({
      status: false,
      message: "Failed to record your feedback. Please try again later.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const userFeedbacks = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
    });

    if (userFeedbacks) {
      return res.status(200).json({
        status: true,
        message: "Fetched user feedbacks successfully.",
        feedbacks: userFeedbacks,
      });
    }

    res.status(404).json({
      status: false,
      message: "No feedbacks found",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const existingFeedback = await Feedback.findOne({
      where: {
        id: feedbackId,
      },
    });

    if (!existingFeedback) {
      return res.status(404).json({
        status: false,
        message: "No such bookmark found.",
      });
    }

    const isFeedbackDeleted = await existingFeedback.destroy();

    if (!isFeedbackDeleted) {
      return res.status(204).json({
        status: false,
        message: "Failed to delete feedback",
      });
    }

    res.status(200).json({
      status: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { addNewFeedback, getAllFeedbacks, deleteFeedback };
