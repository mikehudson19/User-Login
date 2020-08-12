const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');


const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${username}:${password}@cluster0.cstov.mongodb.net/usersDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


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

