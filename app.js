const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended : true}))

app.use(expressLayouts);
app.set('view engine', 'ejs');

console.log(process.env);
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cstov.mongodb.net/usersDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Mongoose schema
const userSchema = new mongoose.Schema ({
  name: String,
  email: String,
  password: String,
  password2: String
})

// Mongoose model
const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
  res.render('home');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/register', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2
  })
  user.save();
  res.send('Done');
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})

