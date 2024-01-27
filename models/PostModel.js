"use strict";

module.exports = (sequelize,DataTypes) =>{
    const Post = sequelize.define("Post", {
        filetype:{
            type: DataTypes.STRING,
        },
        attachment:{
            type: DataTypes.STRING,   
        },
        tag:{
            type: DataTypes.STRING
        },
        upvote: {
            type: DataTypes.JSON,
            defaultValue: [], 
        },
        domain:{
            type: DataTypes.STRING
        },
        note:{
            type: DataTypes.STRING,
            allowNull : true
        }
    });

    Post.associate = models => {
        Post.belongsTo(models.User, {
            foreignKey: 'createdby',
            as: 'UserModel'
        })
        
    }

    return Post;
};