"use strict";

module.exports = (sequelize,DataTypes) =>{
    const Post = sequelize.define("Post", {
        fileType:{
            type: DataTypes.STRING,
        },
        attachment:{
            type: DataTypes.STRING,   
        },
        category:{
            type: DataTypes.STRING
        },
        tag:{
            type: DataTypes.STRING
        },
        upvote: {
            type: DataTypes.JSON,
            defaultValue: [], 
        },
    });

    Post.associate = models => {
        Post.belongsTo(models.User, {
            foreignKey: 'createdBy',
            as: 'UserModel'
        })
        
    }

    return Post;
};