const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: String,
    title: String,
    topics: [String],
    communityTheme: String,
    description: String,
    avatar: String,
    moderator: new mongoose.Schema({
        username: String,
        uniqueUserId: String,
    }),
    ratings: [
        new mongoose.Schema({
            uniqueUserId: String,
            rating: Number,
        }),
    ],
    rating: {
        type: Number,
        default: 0,
    },
    rules: [
        new  mongoose.Schema({
            rule: String,
            reason: String,
        }),
    ],
    chatRoom: new mongoose.Schema({
        name: String,
        community: String,
        title: String,
        messages: [
            new mongoose.Schema({
                username: String,
                uniqueUserId: String,
                utcTime: Number,
                dateString: String,
                uniqueMessageId: String,
                community: String,
                room: String,
                text: String,
            }),
        ],
    }),
    members: [
        new mongoose.Schema({
            uniqueUserId: String,
            username: String,
        }),
    ],
    blockList: [
        new mongoose.Schema({
            uniqueUserId: String,
            username: String,
        }),
    ],
    communityPrivacy: {
        type: String,
        default: 'public',
    },
    createdOn: String,
},
{
    collection: 'communities',
});

module.exports = communitySchema;