const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose'); 

const dbUri = process.env.DB;

const connection = mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;