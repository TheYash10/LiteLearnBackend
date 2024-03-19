// import  Express  from "express";
// import appRoutes from './router.js'

const Express = require("express");
const authRoutes = require("./Routes/authRoutes.js");
const postRoutes = require("./Routes/postRoutes.js");
const commentRoutes = require("./Routes/commentRoutes.js");
const replyRoutes = require("./Routes/replyRoutes.js");
const bookmarkRoutes = require("./Routes/bookmarkRoutes.js");
const feedbackRoutes = require("./Routes/feedbackRoutes.js");
const leaderboardRoutes = require("./Routes/leaderboardRoutes.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = 2000;

const app = Express();

app.use(cors());
// app.use(bodyParser.json());
app.use(Express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/reply", replyRoutes);
app.use("/bookmark", bookmarkRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.listen(port, () => {
  console.log(`Server is now running on port no ${port}`);
});
