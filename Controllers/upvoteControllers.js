const { UpvoteModel } = require("../models")

const upvotePost = async (req, res) => {

    const postId = req.params.id;

    try {

        const findId = await UpvoteModel.findOne({
            where: {
                UserId: req.userId,
                PostId: postId
            }
        })

        if (findId) {
            const response = await UpvoteModel.destroy({
                where: {
                    UserId: req.userId,
                    PostId: postId
                }
            })


            if (response) {
                res.status(200).json({
                    status: true,
                    message: "Upvote Deleted Successfully!",
                })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Can't able to perform destroy query"
                })
            }
        }
        else {
            const response = await UpvoteModel.create({
                UserId: req.userId,
                PostId: postId
            })


            if (response) {
                res.status(200).json({
                    status: true,
                    message: "Upvote Added Successfully!",
                })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Can't able to perform destroy query"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


module.exports = { upvotePost }