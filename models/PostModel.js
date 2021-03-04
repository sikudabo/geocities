const mongoose = require('mongoose');
const postSchema = require('../schemas/PostSchema');

const postModel = mongoose.model('postModel', postSchema);

module.exports = postModel;