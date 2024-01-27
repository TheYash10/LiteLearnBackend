"use strict";
const uuid = require("uuid");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile:{
      type:DataTypes.STRING,
      allowNull:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull:true
    },
    domain:{
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.Post, {
      foreignKey: 'createdby',
      as: 'PostModel'
    });
  };

  return User;
};
