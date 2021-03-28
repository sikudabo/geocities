const mongoose = require('mongoose'); 

//const dbUri = 'mongodb+srv://sikudabo:shooter1@cluster0.zkhru.mongodb.net/tester?retryWrites=true&w=majority';
const dbUri = 'mongodb://localhost:27017/geocities';

const connection = mongoose.connect(dbUri);

module.exports = mongoose;