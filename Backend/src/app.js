const express = require("express");
const app = express(); // to create an instance of server..
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Middleware..
app.use(express.json()); // allows data in req.body...
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
// require all the routes here.
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

// using all the routes here..
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
module.exports = app;

