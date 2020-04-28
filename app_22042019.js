/* My app modules */
const createError = require('http-errors');
// const cron = require("node-cron");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const cors = require('cors');

/* My exports */
const {
  connection
} = require('./App/configs');

/* Middleware */
const {
  auth,
  formValidator
} = require('./App/middleware');

/* Mongoose DB connection */
connection();


/* Admin Rotes */

// const admin = require('./App/routes/admin-r');

/* My Routers */
const user = require('./App/routes/users-r');
const ridepost = require('./App/routes/ridepost_r');
const timeline = require('./App/routes/timeline_r');
// const feedback = require('./App/routes/feedback_r');
//  const settings = require('./App/routes/settings_r');
// const messageChat = require('./App/routes/message_r');

/* Express Settings and work */
const app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


// app.use(auth.verifyToken);
// app.use(formValidator.validate);

//Admin
// console.log(52434);


// app.use('/', indexRouter);
// Users
app.use('/user', user);
app.use('/ride', ridepost);
app.use('/timeline', timeline);

// My cron Jobs 



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'The url you have is not available. Please check and try again'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message
  });

  return false;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;