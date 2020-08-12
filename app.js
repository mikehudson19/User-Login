const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('home');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})