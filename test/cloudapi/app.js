var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mobileAuthRouter = require("./routes/mobileAuth");
const mobileDevicesRouter = require("./routes/mobileDevices");

var app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://rms.macsoftautomations.in',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "150mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Route to get MQTT credentials
app.use("/api", indexRouter);
app.use("/api/mobile/auth", mobileAuthRouter);
app.use("/api/mobile/devices", mobileDevicesRouter);

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
