const mongoose = require('mongoose');
const communitySchema = require('../schemas/CommunitySchema');

const CommunityModel = mongoose.model('CommunityModel', communitySchema);

module.exports = CommunityModel;