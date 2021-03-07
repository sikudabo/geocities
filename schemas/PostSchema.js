const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    uniquePostId: String,
    uniqueUserId: String,
    username: String,
    utcTime: Number,
    dateString: String,
    likes: [String],
    comments: [
        new mongoose.Schema({
            uniqueCommentId: String,
            uniqueUserId: String,
            username: String,
            utcTime: Number,
            dateString: String,
            text: String,
            likes: [String],
        }),
    ],
    type: String,
    context: String,
    text: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    caption: {
        type: String,
        default: '',
    },
    community: {
        type: String,
        default: '',
    },
    src: {
        type: String,
        default: '',
    },
    privacy: String,
    blockList: {
        default: [],
        type: Array,
    },
    linkImage: {
        default:'',
        type: String,
    },
    linkDescription: {
        default: '',
        type: String,
    },
},
{
    collection: 'posts',
});

module.exports = postSchema;