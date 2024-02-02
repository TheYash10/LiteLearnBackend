const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const User = require("../models").User;
const sendResetPasswordEmail = require("../middleware/nodeMailer");

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
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
          username,
          password: hashedPassword,
          email,
          domain,
        });

        return res.status(200).json({
          status: true,
          message: `Hii, ${newUser.username}, Welcome to LiteLearn. (Signed Up Successfully.)`,
          user: newUser,
        });
      } else {
        return res.status(409).json({
          status: false,
          message: "Email-Id is already in use.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong! sign-up failed.",
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
          id: user.id,
        },
        secretKey
      );

      res
        .cookie("access_token", accessToken)
        .status(200)
        .json({
          status: true,
          message: `Hii, ${user.username}. Welcome Back !! (Signed In Successfully.)`,
          user: {
            username: user.username,
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
  res.json({ status: true, message: "Response OK" });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User with this email does not exists",
      });
    }

    const secretKey = process.env.ACCESS_SECRET_TOKEN;
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey,
      {
        expiresIn: "5m",
      }
    );

    const data = sendResetPasswordEmail(
      user.id,
      user.username,
      token,
      user.email
    );

    data.then((response) => {
      console.log(response);
      if (response.rejected && response.rejected.length === 0)
        res.status(200).json({
          status: true,
          message: "Check your email to reset the password",
        });
    });
  } catch (error) {
    console.log("Error ", error);

    return res.status(500).json({
      status: false,
      message: "Error during authentication",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  let userId;

  const { resetToken, newPassword } = req.body;
  try {
    jwt.verify(
      resetToken,
      process.env.ACCESS_SECRET_TOKEN,
      (error, decoded) => {
        if (error) {
          res.status(408).json({
            status: false,
            message: "Request Timeout",
          });
          return;
        }

        userId = decoded.id;
      }
    );

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const response = await user.update({ password: hashedNewPassword });

    if (response) {
      return res.status(200).json({
        status: true,
        message: "Your Password is updated Successfully",
      });
    } else {
      return res.status(500).json({
        status: true,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error during authentication",
    });
  }
};

const signInWithGoogleCredentials = async (req, res) => {
  const { username, email, profilePic } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      //Already Existing User => Perform SignIn
      const token = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET_TOKEN);

      const { password, createdAt, updatedAt, ...reqUserData } =
        user.dataValues;

      res
        .cookie("access_token", token)
        .status(200)
        .json({
          statue: true,
          message: `Hii, ${user.username}. Welcome Back !! (Signed In Successfully.)`,
          user: reqUserData,
        });
    } else {
      //New User => Perform SignUp
      const newUser = await User.create({
        id: uuid.v4(),
        username,
        email,
        profile: profilePic,
      });

      const token = jwt.sign(
        { id: newUser.id },
        process.env.ACCESS_SECRET_TOKEN
      );

      const { password, createdAt, updatedAt, ...reqUserData } =
        newUser.dataValues;

      res
        .cookie("access_token", token)
        .status(200)
        .json({
          status: true,
          message: `Hii, ${newUser.username}, Welcome to LiteLearn. (Signed Up Successfully.)`,
          user: reqUserData,
        });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Some thing went wrong, while sign-in with google.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  signInWithGoogleCredentials,
};
