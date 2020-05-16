const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const engine = require('ejs-mate');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

const session = require('express-session');

const User = require('./models/user');
const indexRouter = require('./routes/index');

const usersRouter = require('./routes/users');

//connect to database
mongoose.connect('mongodb://mongo:27017/food-recipes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
	console.log('we\'re connected');
});
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//Configure passport and sessions
app.use(session({
	secret: 'hang ten dude!',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//title middleware
app.use(function(req, res, next) {
  // req.user = {
  //   '_id' : '5e7dd2792801d822577fa9d6',
  //   'username' : 'cassie'
  // }
  res.locals.currentUser = req.user;
  res.locals.title = 'Food Recipes';
  res.locals.success = req.session.success || '';
  delete req.session.success;
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
});

// Mount routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  req.session.error = err.message;
  res.redirect('back');
});

app.listen(port);
console.log('Connected');
