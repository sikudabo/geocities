const mongoose = require('mongoose'); 

const dbUri = "mongodb+srv://sikudabo:linkkup01@cluster0.zkhru.mongodb.net/tester?retryWrites=true&w=majority";

const connection = mongoose.connect(dbUri);

module.exports = mongoose;