// import  Express  from "express";
// import appRoutes from './router.js'

const Express = require("express");
const appRoutes = require("./Routes/authRoutes.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 2000;

const app = Express();

app.use(cors());

app.use(bodyParser.json());
app.use("/", appRoutes);

app.listen(port, () => {
  console.log(`Server is now running on port no ${port}`);
});
