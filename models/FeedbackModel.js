"use strict";

module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define("Feedback", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    feedback: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: "feedbackBy",
      as: "UserModel",
    });
  };

  return Feedback;
};
