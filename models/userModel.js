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

  return User;
};
