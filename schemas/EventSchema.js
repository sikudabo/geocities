const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    uniqueUserId: String,
    username: String,
    src: String,
    attending: [
        new mongoose.Schema({
            username: String,
            uniqueUserId: String,
        }),
    ],
    dateString: String,
    topics: [String],
    likes: [
        new mongoose.Schema({
            username: String,
            uniqueUserId: String,
        }),
    ],
    utcTime: Number,
    utcTimeCreated: Number,
    uniqueEventId: String,
    city: String,
    state: String,
    location: {},
},
{
    collection: 'events',
});

module.exports = eventSchema;