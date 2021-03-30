const mongoose = require('mongoose');
const eventSchema = require('../schemas/EventSchema');

const eventModel = mongoose.model('eventModel', eventSchema);

module.exports = eventModel;