const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const User = require("../models").User;

const registerUser = async (req, res) => {
  const { userName, password, email } = req.body;

  if (!userName || !password || !email) {
    return res.status(400).json({
      status: false,
      message: "All Fields are Mandatory!",
    });
  } else {
    try {
      const existingUser = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
          id: uuid.v4(),
          userName,
          password: hashedPassword,
          email,
        });

        return res.status(200).json({
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

    if (user && (await bcrypt.compare(password, user.password))) {
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

      res
        .cookie("access_token", accessToken)
        .status(200)
        .json({
          status: true,
          message: "Authentication successful",
          user: {
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
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error during authentication",
    });
  }
};

// Get Current User
const currentUser = async (req, res) => {
  res.json({ status: true, user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
