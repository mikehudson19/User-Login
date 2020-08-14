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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cstov.mongodb.net/usersDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/access', (req, res) => {
  res.render('access');
})

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register', {messages: 'user exists'});
})

app.post('/register', (req, res) => {

  User.findOne({email: req.body.email })
    .then(user => {
      if (user) {
        console.log('User already exists');
        res.redirect('/register');
      } else {
        const user = new User({
          name: req.body.name,
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
 
app.post('/login', passport.authenticate('local', {
  successRedirect: '/access',
  failureRedirect: '/login',
  failureFlash: true
}))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})

