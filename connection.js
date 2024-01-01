const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dnfdqsr.mongodb.net/?retryWrites=true&w=majority`;

const connection = mongoose
  .connect(uri)
  .then(() => console.log('connected to mongo atlas'))
  .catch((err) => console.log(err));

module.exports = connection;
