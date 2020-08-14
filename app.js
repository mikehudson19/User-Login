const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const app = express();

const initializePassport = require('./config/passport');

initializePassport(passport);

app.use(bodyParser.urlencoded({ extended : true }))
app.use(express.urlencoded({ extended: false }));

const User = require('./User');


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(flash());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static("public"));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'));

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cstov.mongodb.net/usersDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.get('/access', checkAuthenticated, (req, res) => {
  res.render('access');
})

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
})



app.post('/register', checkNotAuthenticated, (req, res) => {
  const errors = [];

  User.findOne({email: req.body.email })
    .then(user => {
      if (user) {
        errors.push('User already exists.')
        res.render('register', {messages: errors} );
      } else if (req.body.password.length < 6) {
        console.log(req.body.password)
        errors.push('Password must be longer than 6 characters.')
        res.render('register', {messages: errors} );
      } else if (!/[A-Z]/.test(req.body.password)) {
        console.log(req.body.password)
        errors.push('Password must contain at least one uppercase character.')
        res.render('register', {messages: errors} );
        console.log(errors);

      } else if (!/[a-z]/.test(req.body.password)) {
        console.log(req.body.password)
        errors.push('Password must contain at least one lowercase character.')
        console.log(errors);
        res.render('register', {messages: errors} );
      } else if (!/[0-9]/.test(req.body.password)) {
        console.log(req.body.password)
        errors.push('Password must contain at least one number.')
        res.render('register', {messages: errors} );
      } else if (!/\W|_/g.test(req.body.password)) {
        console.log(req.body.password)
        errors.push('Password must contain at least one special character.')
        res.render('register', {messages: errors} );
      } else {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2
        })
    
        // Hash and salt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash;
              user.password2 = hash;
              user.save();
              console.log(user);
          });
        });
        res.render('login');
      }
    })
    .catch(err => console.log(err));

   
  
})
 
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/access',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   return res.redirect('/access');
  }
  next();
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})

