var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Route to get MQTT credentials
app.get("/getcredentials", async (req, res) => {
  const { imeinumber } = req.query;
  if (!imeinumber) return res.status(400).json({ error: "IMEI number required" });

  try {
    const credentials = await prisma.mqttCredentials.findUnique({
      where: { imeinumber },
    });

    if (!credentials) return res.status(404).json({ error: "IMEI not found" });

    res.json({
      host: credentials.host,
      port: credentials.port,
      username: credentials.username,
      password: credentials.password,
      pubTopic: credentials.pubTopic,
      subTopic: credentials.subTopic,
    });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
