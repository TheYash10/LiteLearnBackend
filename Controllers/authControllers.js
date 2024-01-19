const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../models").User;
const sendResetPasswordEmail = require('../middleware/nodeMailer')



// Register a user
const registerUser = async (req, res) => {

    const {
        userName,
        password,
        email,

    } = req.body;

    if (!userName || !password || !email) {
        return res.status(400).json({
            status: false,
            message: "All Fields are Mandatory!",
        });
    }
    else {
        try {
            const existingUser = await User.findOne({
                where: {
                    email: email
                },
            });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = await User.create({
                    userName,
                    password: hashedPassword,
                    email,
                });

                return res.status(201).json({
                    status: true,
                    message: "User Registered",
                    user: newUser,
                });
            } else {
                return res.status(409).json({
                    status: false,
                    message: "Email is already in use",
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "Failed to register user",
            });
        }
    }
};

// Login a User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "All Fields are mandatory!",
        });
    }

    try {
        const user = await User.findOne({
            where: { email: email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const secretKey = process.env.ACCESS_SECRET_TOKEN;

            const accessToken = jwt.sign(
                {
                    user: {
                        userName: user.userName,
                        email: user.email,
                        id: user.id,
                    },
                },
                secretKey
            );

            return res.status(200).json({
                status: true,
                message: "Authentication successful",
                token: accessToken,
                userDetails: {
                    userName: user.userName,
                    email: user.email,
                    id: user.id,
                },
            });
        } else {
            return res.status(401).json({
                status: false,
                message: "Email and password are not valid",
            });
        }
    } catch (error) {

        return res.status(500).json({
            status: false,
            message: "Error during authentication",
        });
    }
};

// Get Current User
const currentUser = async (req, res) => {
    res.json({ status: true, user: req.user })
}

// Forgot Password
const forgotPassword = async (req, res) => {

    const { email } = req.body;


    try {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ status: false, message: "User with this email does not exists" })
        }

        const secretKey = process.env.ACCESS_SECRET_TOKEN;
        const token = jwt.sign(
            {
                user: {
                    userName: user.userName,
                    email: user.email,
                    id: user.id,
                },
            },
            secretKey,
            {
                expiresIn: "5m"
            }
        );

        const data = sendResetPasswordEmail(user.id, token, user.email)

        data.then((response) => {
            console.log(response)
            if (response.rejected && response.rejected.length === 0)
                res.status(200).json({
                    status: true,
                    message: "Check your email to reset the password"
                })
        }).catch((err) => {
            res.status(500).json({
                status: false,
                message: "Internal Server Error"
            })
        })

    } catch (error) {

        console.log("Error ", error);

        return res.status(500).json({
            status: false,
            message: "Error during authentication",
        });

    }
}

// Reset Password
const resetPassword = async (req, res) => {


    let userId;

    const { resetToken, newPassword } = req.body;
    try {
        jwt.verify(resetToken, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
            if (error) {
                return res.status(408).json({
                    status: false,
                    message: "Request Timeout"
                })
            }

            // req.user = decoded.user

            userId = decoded.user.id
        })


        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const response = await user.update({password:hashedNewPassword})

        console.log(response)

        return res.status(200).json({
            status:true
        })



    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Error during authentication",
        });
    }

}



module.exports = {
    registerUser,
    loginUser,
    currentUser,
    forgotPassword,
    resetPassword
}