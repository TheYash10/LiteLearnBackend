// import  Express  from "express";
// import appRoutes from './router.js'

const Express = require("express");
const authRoutes = require("./Routes/authRoutes.js");
const postRoutes = require("./Routes/postRoutes.js")
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
app.use("/post",postRoutes)

app.listen(port, () => {
  console.log(`Server is now running on port no ${port}`);
});
