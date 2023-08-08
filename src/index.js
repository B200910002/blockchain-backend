require("dotenv").config();
const express = require("express");
const app = express();
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const blockchainRoute = require("./routes/blockchain.route");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// server engine setup
app.use(logger("[:date[iso]] :method :url :status - :response-time ms"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

const whitelist = ['http://localhost:3000', 'https://b200910002.github.io', 'https://test-c2dk.onrender.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

//routes
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/api/v1/blockchain", blockchainRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
