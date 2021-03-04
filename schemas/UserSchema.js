const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    birthdate: String,
    city: String,
    userState: String,
    college: String,
    interests: [],
    twitterHandle: String,
    instaHandle: String,
    youtubeChannel: String,
    avatar: String,
    profileTheme: String,
    bio: String,
    currentLocation: {},
    avatar: String,
    utcBirthdate: Number,
    dateCreated: Number,
    following: [
        new mongoose.Schema({
            username: String,
            uniqueUserId: String,
        }),
    ],
    followers: [
        new mongoose.Schema({
            username: String,
            uniqueUserId: String,
        }),
    ],
    uniqueUserId: String,
    communities: [],
    events: [],
    blockList: [],
    verifiedUser: Boolean,
    notifications: [
        new mongoose.Schema({
            sender: String,
            date: Number,
            msg: String,
            type: String,
            uniqueSenderId: String,
            link: String,
            uniqueNotificationId: String,
            community: {
                type: String,
                default: '',
            },
            hash: String,
            path: String,
        }),
    ],
    profilePrivacy: String,
    karma: Number,
},
{
    collection: 'users',
});

module.exports = userSchema;