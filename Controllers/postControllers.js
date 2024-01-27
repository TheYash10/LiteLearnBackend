const uuid = require('uuid');
const { Post } = require('../models')

const User = require('../models').User

// Create New Post 

const createPost = async (req, res) => {
    const {
        filetype,
        attachment,
        tag,
        upvote,
        domain,
        note
    } = req.body;

    try {
        const newPost = await Post.create({
            id: uuid.v4(),
            filetype,
            attachment,
            tag,
            upvote,
            domain,
            note,
            createdby: req.userId
        })

        // Retrieve user details for the response
        const user = await User.findOne({
            where: { id: req.userId },
        });

        res.status(200).json({
            status: true,
            message: "Post Created Successfully!",
            postDetails: newPost,
            userDetails: {
                id: user.id,
                email: user.email,
                profile: user.profile
            }
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        })
    }
}


const updatePost = async (req, res) => {


    try {

        const postData = Post.findOne({
            where: {
                id: req.params.id
            }
        });

        if (postData) {
            const updatedPost = Post.update({
                filetype: req.body.filetype,
                attachment: req.body.attachment,
                tag: req.body.tag,
                domain: req.body.domain,
                note: req.body.note
            }, {
                where: {
                    id: req.params.id
                }
            });

            if (updatedPost) {
                res.status(200).json({
                    status: true,
                    message: "Post Updated Successfully"
                })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to update Post"
                })
            }
        }
        else {
            res.status(404).json({
                status: false,
                message: "Post not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


module.exports = { createPost, updatePost }