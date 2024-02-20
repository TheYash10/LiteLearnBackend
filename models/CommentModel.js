"use strict";

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: "commentedBy",
      as: "UserModel",
    });

    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "PostModel",
    });
  };

  return Comment;
};
