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
const contact = require('./App/routes/contact_provider_r');
const patient = require('./App/routes/patient_refferel_r');
const education = require('./App/routes/education_video_r');
const admin = require('./App/routes/admin_r');
const providersOpening = require('./App/routes/openingDays_r');
const providersTiming = require('./App/routes/openingTime_r');
const storeTimings = require('./App/routes/storeTimings');

const patientConstent = require('./App/routes/patientConstent_r.js');
const patientDocument = require('./App/routes/patientDocument.js');
const questionsCategories = require('./App/routes/questionsCategories.js');

const psychometricQuestions = require('./App/routes/psychometricQuestions.js')
const answersSubmition = require('./App/routes/answersSubmition.js')
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
app.use('/admin', admin);

// Users
app.use('/user', user);
app.use('/contact', contact);
app.use('/patient', patient);
app.use('/education', education);
app.use('/providersOpening', providersOpening);
app.use('/providersTiming', providersTiming);
app.use('/storeTimings', storeTimings);

app.use('/patientConstent', patientConstent);
app.use('/questionsCategories', questionsCategories);
app.use('/psychometricQuestions',psychometricQuestions);

app.use('/patientDocument', patientDocument);
app.use('/answersSubmition',answersSubmition)
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