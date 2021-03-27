const mongoose = require('mongoose');
const threadSchema = require('../schemas/ThreadSchema');

const ThreadModel = mongoose.model('ThreadModel', threadSchema);

module.exports = ThreadModel;