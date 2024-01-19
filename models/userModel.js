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

  // User.beforeCreate((user, _) => {
  //   return (user.id = uuid.v4());
  // });

  return User;
};
