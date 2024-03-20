"use strict";

module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define("Bookmark", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookmark: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: "bookmarkedBy",
      as: "UserModel",
    });
  };

  return Bookmark;
};
