const mongoose = require('mongoose'); 

const dbUri = 'mongodb://localhost:27017/excitedb';

const connection = mongoose.connect(dbUri);

module.exports = mongoose;