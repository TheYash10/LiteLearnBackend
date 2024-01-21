const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  //   console.log(authHeader);

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        status: false,
        message: "Access token is missing. Please sign-in to have one.",
      });
    }
    // console.log(token);
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
      if (error) {
        res.json({
          status: false,
          message:
            "Unable to proceed, due to invalid access token. please sign-in and try again.",
        });
      }
      // console.log(decoded)
      req.userId = decoded.id;
      next();
    });
  } else {
    res.status(401).json({
      status: false,
      message: "Access token is missing. Please sign-in and try again.",
    });
  }
};

module.exports = validateToken;
