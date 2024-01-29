"use strict";

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        filetype: {
            type: DataTypes.STRING,
        },
        attachment: {
            type: DataTypes.STRING,
        },
        tag: {
            type: DataTypes.STRING
        },
        domain: {
            type: DataTypes.STRING
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Post.associate = models => {
        Post.belongsTo(models.User, {
            foreignKey: 'createdby',
            as: 'UserModel'
        })


        Post.belongsToMany(models.User, {
            through: "UpvoteModel"
        })

    }

    return Post;
};