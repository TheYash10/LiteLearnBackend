"use strict";

module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define("Leaderboard", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    totalComments: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    totalUpvotes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    popularity: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
  });

  Leaderboard.associate = (models) => {
    Leaderboard.belongsTo(models.User, {
      foreignKey: "userId",
      as: "UserModel",
    });
  };

  return Leaderboard;
};
