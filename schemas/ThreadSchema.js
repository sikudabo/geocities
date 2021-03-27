const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    uniqueThreadId: String,
    usernames: [String],
    uniqueUserIds: [String],
    utcTime: Number,
    messages: [
        new mongoose.Schema({
            senderUniqueUserId: String,
            receiverUniqueUserId: String,
            senderUsername: String,
            receiverUsername: String,
            msg: String,
            dateString: String,
            utcTime: Number,
            uniqueMessageId: String,
        }),
    ],
},
{
    collection: 'threads',
});

module.exports = ThreadSchema;