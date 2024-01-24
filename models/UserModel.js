"use strict";
const uuid = require("uuid");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: "createdBy",
      as: "PostModel",
    });
  };

  return User;
};
