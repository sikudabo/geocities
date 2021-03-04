const userSchema = require('../schemas/UserSchema');
const mongoose = require('mongoose');

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;