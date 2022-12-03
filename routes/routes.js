const path = require('path');
const dotenv = require('dotenv').config();
const router = require('express').Router();
const User = require('../models/UserModel'); //Import the user model for mongoose connectivity.
const Post = require('../models/PostModel');
const Community = require('../models/CommunityModel');
const Thread = require('../models/ThreadModel');
const Event = require('../models/EventModel');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const _ = require('underscore');
const { mdiConsoleNetwork } = require('@mdi/js');
const axios = require('axios');

const dbUri = process.env.DB;

var conn = mongoose.createConnection(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

conn.once('open', () => {
    // Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    return 'done';
});

const storage = new GridFsStorage({
    url: dbUri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
          const filename = Date.now() + "-" + file.fieldname + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
    }
});

const uploads = multer({ storage });


//The route below will handle loggin a user into GeoCities.
router.route('/api/login').post((req, res) => {
    //This is the route that will log a user into their profile. 
    //First, get the username and password from the body of the request object from the post request.
    let username = req.body.username;
    let password = req.body.password;
    console.log('Someone is trying to login');

    if(!req.body.username) {
        //Condition to handle if no username is found in the request. 
        res.status(200).send('user not found');
    }

    //Wrap everything in a try/catch block 
    try {
        //Now, perform a query to get the user from the DB. 
        User.findOne({username: username}, (err, user) => {
            if(err) {
                //If there is an error, log the error to the console and send an error message to client.
                console.log(err.message);
                res.status(500).send('There was an error retrieving that user from the database');
            }
            else {
                //Check to see that the user was found. If not, that username doesn't exist. Send message to client.
                if(!user) {
                    console.log('Username not found in database on log in attempt.');
                    res.status(200).send('user not found');
                }
                else {
                    //Get the password associated with this username and match it against the username the client sent.
                    let checkPass = user.password;
                    if(checkPass === password) {
                        console.log('User verified on their login attempt.');
                        res.status(200).json({user: user});
                    }
                    else {
                        //Send back an invalid password message if the user's password didn't match the
                        console.log('User entered the wrong password on a log in attempt.');
                        res.status(200).send('invalid password');
                    }
                }
            }
        });
    }
    catch(err) {
        //Catch any errors. Log them to the console and send an error message to the client. 
        console.log('Error trying to log a user in:', err.message);
        res.status(500).send('error loggin user in');
    }
});
//-----------------------------------------------------------------------------------------------------
//The route below will enable a new user to sign up and be added to the database.
router.route('/api/signup').post(uploads.single('avatar'), (req, res) => {
    //This route will handle creating a new user and saving them to the database.
    try {
        let username = req.body.username;
        User.findOne({username: username}, (err, result) => {
            //Check to see if the username is already taken.
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(result) {
                console.log('High');
                res.status(200).send('username taken');
            }
            else {
                let uniqueUserId = Date.now() + username; //Create the unique ID to identify the user 
                let newNotification = {
                    sender: 'GeoCities',
                    date: Date.now(),
                    msg: 'Welcome to GeoCities!',
                    type: 'welcome',
                    uniuqeSenderId: '',
                    link: '#',
                    uniqueNotificationId: 'notification' + Date.now() + 'signUpNote',
                }; //Send a welcome message notification to the user. 
                let interests = req.body.interests.split(','); //Conver interests to an array
                let newUser = new User({
                    uniqueUserId: uniqueUserId,
                    username: username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    birthdate: req.body.birthDate,
                    utcBirthDate: req.body.utcBirthDate,
                    dateCreated: req.body.dateCreated,
                    city: req.body.town,
                    userState: req.body.userState,
                    college: req.body.college,
                    interests: interests,
                    twitterHandle: req.body.twitterHandle,
                    instaHandle: req.body.instaHandle,
                    youtubeChannel: req.body.youtubeChannel,
                    profileTheme: req.body.profileTheme,
                    bio: req.body.bio,
                    currentLocation: req.body.currentLocation,
                    avatar: req.file.filename,
                    followers: [],
                    following: [],
                    blockList: [],
                    profilePrivacy: 'public',
                    communities: [],
                    events: [],
                    karma: 0,
                    notifications: [newNotification],
                    verifiedUser: false,
                    profileTheme: req.body.profileTheme,
                });

                //Now we need to save this user to the database. 
                newUser.save((err, user) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({user: user});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------

//The route below will handle grabbing a user within a get request from the database. 
router.route('/api/grab/user/:uniqueUserId').get((req, res) => {
    try {
        console.log(`The uniqueUserId is: ${req.params.uniqueUserId}`);
        let uniqueUserId = req.params.uniqueUserId; //get the userId from params. 
        if(!uniqueUserId) {
            uniqueUserId = 1;
        }
        User.findOne({uniqueUserId: uniqueUserId}, (err, user) => {
            if(err) {
                console.log('There was an error grabbing a user from the databse at line 163');
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(!user) {
                console.log('We could not find a user to grab at line 168');
                console.log(err.message);
                res.status(200).send('user not found');
            }
            else {
                console.log(`The user communities are ${user.communities}`);
                let userCommunities = user.communities;
                console.log('It was able to read user.communities here. ')
                //Now grab the communities a user belongs to. Test the "members" attribute. 
                Community.find({name: {$in: userCommunities}}, (err, communities) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        Post.find({uniqueUserId: user.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                            if(err) {
                                console.log('There was an error retreiving the posts for a user at line 180.');
                                res.status(500).send('error');
                            }
                            else if(!posts) {
                                res.status(200).json({user: user, posts: []});
                            }
                            else {
                                //Now, grab each user in the DB.
                                User.find({}, (err, users) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        //Now grab the events associated with this user 
                                        Event.find({uniqueUserId: req.params.uniqueUserId}, (err, events) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                res.status(200).json({user: user, posts: posts, communities: communities, users: users, events: events});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------

//Route to serve photos in a get request based on the file name.
router.route('/api/get-photo/:photo').get((req, res) => {
    
    let photo = req.params.photo;
    gfs.files.findOne({ filename: photo }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          console.log('Could Not Find The Photo');
          return res.status(404).json({
            err: 'No file exists'
          });
        }
        else {
            let readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
    });
});
//-----------------------------------------------------------------------------------------------------------

//The route below will get a community avatar by community name 
router.route('/api/get/avatar/by/community/name/:name').get((req, res) => {
    try {
        Community.findOne({name: req.params.name}, (err, community) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                
                let photo = community.avatar;
                gfs.files.findOne({ filename: photo }, (err, file) => {
                    // Check if file
                    if (!file || file.length === 0) {
                      console.log('Could Not Find The Photo');
                      return res.status(404).json({
                        err: 'No file exists'
                      });
                    }
                    else {
                        let readstream = gfs.createReadStream(file.filename);
                        readstream.pipe(res);
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error getting a photo by community name');
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will handle getting a video file from the database and streaming it to the server. 
router.route('/api/get-video/:video').get((req, res) => {
    let video = req.params.video;
    
    gfs.files.findOne({ filename: video }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          console.log('Could Not Find The Video');
          return res.status(404).json({
            err: 'No file exists'
          });
        }
        else {
            //let readstream = gfs.createReadStream(file.filename);
            //readstream.pipe(res);
            if (req.headers['range']) {
                let parts = req.headers['range'].replace(/bytes=/, "").split("-");
                let partialstart = parts[0];
                let partialend = parts[1];
    
                let start = parseInt(partialstart, 10);
                let end = partialend ? parseInt(partialend, 10) : file.length - 1;
                let chunksize = (end - start) + 1;
    
                res.writeHead(206, {
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                    'Content-Type': file.contentType
                });
                gfs.createReadStream({
                    _id: file._id,
                    range: {
                        startPos: start,
                        endPos: end
                    }
                }).pipe(res);
            }
            else {
                res.header('Content-Length', file.length);
                res.header('Content-Type', file.contentType);

                gfs.createReadStream({
                    _id: file._id
                }).pipe(res);
            }
        }
    });
});
//-----------------------------------------------------------------------------------------------------------

//The route below will retrieve avatar photos based on a users' ID.
router.route('/api/get/avatar/by/id/:uniqueuserid').get((req, res) => {
    try {
        console.log(req.params.uniqueuserid);
        User.findOne({uniqueUserId: req.params.uniqueuserid}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(!user) {
                res.status(404).send('User avatar not found');
            }
            else {
                
                let avatar = user.avatar;
                gfs.files.findOne({ filename: avatar }, (err, file) => {
                    // Check if file
                    if (!file || file.length === 0) {
                      console.log('Could Not Find The Photo');
                      return res.status(404).json({
                        err: 'No file exists'
                      });
                    }
                    else {
                        let readstream = gfs.createReadStream(file.filename);
                        readstream.pipe(res);
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------

//The route below will handle uploading a text or link post 
router.route('/api/upload/text/link/post').post((req, res) => {
    try {
        let post = new Post({
            uniquePostId: req.body.uniquePostId,
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
            utcTime: Date.now(),
            dateString: req.body.dateString,
            likes: [],
            comments: [],
            type: req.body.type,
            context: req.body.context,
            text: req.body.text,
            link: req.body.link,
            title: req.body.title,
            caption: req.body.caption,
            community: req.body.community,
            src: req.body.src,
            privacy: req.body.privacy,
        });

        post.save((err, result) => {
            if(err) {
                console.log(err.message);
                console.log('Error saving post to database at line 231');
                res.status(500).send('error');
            }
            else {
                //res.status(200).send('success');
                Post.find({uniqueUserId: req.body.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                    if(err) {
                        console.log(err.message);
                        console.log('Error retrieving post after user made a text or link post at line 251');
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).send({posts: posts});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log('There was an error uploading a text or link post at line 240!');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------

//The route below will handle saving a comment from the client to a post in the database. 
router.route('/api/add/comment').post((req, res) => {
    try {
        let newComment = {
            uniqueCommentId: req.body.uniqueCommentId,
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
            utcTime: Date.now(),
            dateString: req.body.dateString,
            text: req.body.text,
            likes: [],
        };

        Post.updateOne({uniquePostId: req.body.uniquePostId}, {$push: {comments: newComment}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(req.body.uniquePosterId !== req.body.uniqueUserId) {
                    let newNotification = {
                        sender: req.body.username,
                        date: Date.now(),
                        msg: `${req.body.username} commented on your post.`,
                        type: 'comment',
                        uniqueSenderId: req.body.uniqueUserId,
                        link: `${process.env.DEV_NETWORK_ADDRESS}profile#${req.body.uniquePostId}`,
                        uniqueNotificationId: Date.now() + 'this' + req.body.uniquePostId,
                    };

                    User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$push: {notifications: newNotification}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniquePosterId}, (err, user) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            res.status(200).json({user: user, posts: posts});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({user: user, posts: posts});
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log('Error sending comment on user post at line 312');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------

//The route below will handle adding a comment when we visit a users' profile page. 
router.route('/api/add/geo/comment').post((req, res) => {
    try {
        let newComment = {
            uniqueCommentId: req.body.uniqueCommentId,
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
            utcTime: Date.now(),
            dateString: req.body.dateString,
            text: req.body.text,
            likes: [],
        };

        Post.updateOne({uniquePostId: req.body.uniquePostId}, {$push: {comments: newComment}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                let newNotification = {
                    sender: req.body.username,
                    date: Date.now(),
                    msg: `${req.body.username} commented on your post.`,
                    type: 'post comment',
                    uniqueSenderId: req.body.uniqueUserId,
                    link: req.body.communityPost === true ? `/community/${req.body.communityName}#${req.body.uniquePostId}` : `/profile#${req.body.uniquePostId}`,
                    uniqueNotificationId: Date.now() + req.body.uniquePostId + 'postcomment' + 'notification',
                };
                if(req.body.uniqueUserId !== req.body.uniquePosterId) {
                    User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$push: {notifications: newNotification}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    if(req.body.communityPost === true) {
                                        Post.find({community: req.body.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, communityPosts) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                res.status(200).json({posts: communityPosts});
                                            }
                                        });
                                    }
                                    else {
                                        res.status(200).json({posts: posts});
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            if(req.body.communityPost === true) {
                                Post.find({community: req.body.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, communityPosts) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        res.status(200).json({posts: communityPosts});
                                    }
                                });
                            }
                            else {
                                res.status(200).json({posts: posts});
                            }
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error trying to add a comment to a users post!');
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will handle liking or unliking a post 
router.route('/api/handle/post/like').post((req, res) => {
    try {
        if(req.body.likeType === 'unlike') {
            Post.updateOne({uniquePostId: req.body.uniquePostId}, {$pull: {likes: req.body.uniqueLikerId}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$inc: {karma: -1}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.findOne({uniqueUserId: req.body.uniqueLikerId}, (err, user) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            res.status(200).json({user: user, posts: posts, likeType: 'unlike'});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            Post.updateOne({uniquePostId: req.body.uniquePostId}, {$push: {likes: req.body.uniqueLikerId}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    if(req.body.uniquePosterId !== req.body.uniqueLikerId) {
                        newNotification = {
                            sender: req.body.username,
                            date: Date.now(),
                            msg: `${req.body.username} liked your post.`,
                            type: 'like',
                            uniqueSenderId: req.body.uniqueLikerId,
                            link: `${process.env.DEV_FE_ADDRESS}profile#${req.body.uniquePostId}`,
                            uniqueNotificationId: Date.now() + 'like' + req.body.uniquePostId + Date.now(),
                        };

                        User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$push: {notifications: newNotification}}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$inc: {karma: 1}}, (err, result) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        User.findOne({uniqueUserId: req.body.uniquePosterId}, (err, user) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        res.status(200).send({user: user, posts: posts, likeType: 'like'});
                                                    }
                                                });
                                            }
                                        });
                                            
                                    }
                                });
                            }
                        });
                    }
                    else {
                        User.updateOne({uniqueUserId: req.body.uniquePosterId}, {$inc: {karma: 1}}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                User.findOne({uniqueUserId: req.body.uniquePosterId}, (err, user) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                res.status(200).send({user: user, posts: posts, likeType: 'like'});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('Error liking or unliking a post at line 398!');
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------

//The route below will handle a post like when a geoUser visits another GeoUsers' page. 
router.route('/api/handle/geo/post/like').post((req, res) => {
    try {
        if(req.body.likeType === 'like') {
            Post.updateOne({uniquePostId: req.body.uniquePostId}, {$push: {likes: req.body.uniqueLikerId}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$inc: {karma: 1}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                        }
                        else {
                            let newNotification = {
                                sender: req.body.username,
                                date: Date.now(),
                                msg: `${req.body.username} liked your post`,
                                type: 'post like',
                                uniqueSenderId: req.body.uniqueLikerId,
                                link: req.body.communityPost === true ? `/community/${req.body.communityName}#${req.body.uniquePostId}` : `/geouser/${req.body.uniqueUserId}#${req.body.uniquePostId}`,
                                uniqueNotificationId: req.body.uniquePostId + 'postlike' + Date.now(),
                            }
                            if(req.body.uniqueLikerId !== req.body.uniqueUserId) {
                                User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {notifications: newNotification}}, (err, result) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, geoUser) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                Post.find({uniqueUserId: req.body.uniqueUserId, 'context': 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        if(req.body.communityPost === true) {
                                                            Post.find({community: req.body.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, communityPosts) => {
                                                                if(err) {
                                                                    console.log(err.message);
                                                                    res.status(500).send('error');
                                                                }
                                                                else {
                                                                    res.status(200).json({posts: communityPosts, likeType: 'like'});
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            res.status(200).json({geoUser: geoUser, posts: posts, likeType: 'like'});
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, geoUser) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        Post.find({uniqueUserId: req.body.uniqueUserId, 'context': 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                if(req.body.communityPost === true) {
                                                    Post.find({community: req.body.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, communityPosts) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            res.status(200).json({posts: communityPosts, likeType: 'like'});
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(200).json({geoUser: geoUser, posts: posts, likeType: 'like'});
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            Post.updateOne({uniquePostId: req.body.uniquePostId}, {$pull: {likes: req.body.uniqueLikerId}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$inc: {karma: -1}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, geoUser) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    Post.find({uniqueUserId: req.body.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            if(req.body.communityPost === true) {
                                                Post.find({community: req.body.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, communityPosts) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        res.status(200).json({posts: communityPosts, likeType: 'unlike'});
                                                    }
                                                });
                                            }
                                            else {
                                                res.status(200).json({geoUser: geoUser, posts: posts, likeType: 'unlike'});
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error when a user tried to like another users profile post');
        res.status(500).send('error');
    }
});
//-----------------------------------------------------------------------------------------------------

//The route below will be responsible for deleting a comment from the database
router.route('/api/delete/comment').post((req, res) => {
    try {
        Post.updateOne({uniquePostId: req.body.uniquePostId}, {$pull: {comments: {uniqueCommentId: req.body.commentId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(req.body.communityPost) {
                    Post.find({community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({user: user, posts: posts});
                                }
                            });
                        }
                    });
                }
                else {
                    Post.find({uniqueUserId: req.body.uniquePosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({user: user, posts: posts});
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log('There was an error deleting a comment!');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------------

//The route below will handle liking a comment when a user is visiting a geoUsers' page. 
router.route('/api/handle/geo/comment/like').post((req, res) => {
    try {
        if(req.body.likeType === 'like') {
            Post.findOne({uniquePostId: req.body.uniquePostId}, (err, post) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    let comment = _.find(post.comments, comment => comment.uniqueCommentId === req.body.commentId);
                    comment.likes.push(req.body.uniqueLikerId);
                    post.save(err => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$inc: {karma: 1}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    if(req.body.uniqueLikerId !== req.body.uniqueCommenterId) {
                                        let newNotification = {
                                            sender: req.body.username,
                                            date: Date.now(),
                                            msg: `${req.body.username} liked your comment`,
                                            type: 'comment like',
                                            uniqueNotificationId: Date.now() + 'commentlike' + req.body.uniqueCommenterId,
                                            uniqueSenderId: req.body.uniqueLikerId,
                                            link: req.body.postType === 'personal' ? `/profile#${req.body.uniquePostId}` : `${process.env.DEV_NETWORK_ADDRESS}communityposts`,
                                        };

                                        User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$push: {notifications: newNotification}}, (err, result) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                if(req.body.communityPost) {
                                                    Post.find({community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                                if(err) {
                                                                    console.log(err.message);
                                                                    res.status(500).send('error');
                                                                }
                                                                else {
                                                                    res.status(200).json({geoUser: user, posts: posts, likeType: 'like'});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    Post.find({uniqueUserId: req.body.uniquePostPosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                                if(err) {
                                                                    console.log(err.message);
                                                                    res.status(500).send('error');
                                                                }
                                                                else {
                                                                    res.status(200).json({geoUser: user, posts: posts, likeType: 'like'});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if(req.body.communityPost) {
                                            Post.find({community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            res.status(200).json({geoUser: user, posts: posts, likeType: 'like'});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            Post.find({uniqueUserId: req.body.uniquePostPosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            res.status(200).json({geoUser: user, posts: posts, likeType: 'like'});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            Post.findOne({uniquePostId: req.body.uniquePostId}, (err, post) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    let comment = _.find(post.comments, comment => comment.uniqueCommentId === req.body.commentId);
                    comment.likes = _.reject(comment.likes, like => like === req.body.uniqueLikerId);
                    post.save(err => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$inc: {karma: -1}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    if(req.body.communityPost) {
                                        Post.find({community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        res.status(200).json({geoUser: user, posts: posts, likeType: 'unlike'});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        Post.find({uniqueUserId: req.body.uniquePostPosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                User.findOne({uniqueUserId: req.body.uniquePostPosterId}, (err, user) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        res.status(200).json({geoUser: user, posts: posts, likeType: 'unlike'});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error liking or unliking a post when visiting a geoUser page');
        res.status(500).send('error');
    }
});
//-----------------------------------------------------------------------------------------------------

//The route below will handle liking a comment within a post. 
router.route('/api/handle/comment/like').post((req, res) => {
    try {
        if(req.body.likeType === 'like') {
            Post.findOne({uniquePostId: req.body.uniquePostId}, (err, post) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    let comment = _.find(post.comments, comment => comment.uniqueCommentId === req.body.commentId);
                    comment.likes.push(req.body.uniqueLikerId);
                    post.save(err => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$inc: {karma: 1}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    if(req.body.uniqueCommenterId !== req.body.uniqueLikerId) {
                                        let newNotification = {
                                            sender: req.body.username,
                                            date: Date.now(),
                                            msg: `${req.body.username} liked your comment.`,
                                            type: 'comment like',
                                            uniqueNotificationId: req.body.uniqueLikerId + Date.now() + req.body.uniqueCommenterId,
                                            uniqueSenderId: req.body.uniqueLikerId,
                                            link: req.body.postType === 'personal' ? `/profile#${req.body.uniquePostId}` : `${process.env.DEV_FE_ADDRESS}/community`,
                                        };

                                        User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$push: {notifications: newNotification}}, (err, result) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                Post.find({uniqueUserId: req.body.uniquePostPosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        User.findOne({uniqueUserId: req.body.uniqueLikerId}, (err, user) => {
                                                            if(err) {
                                                                console.log(err.message);
                                                                res.status(500).send('error');
                                                            }
                                                            else {
                                                                res.status(200).json({user: user, posts: posts, likeType: 'like'});
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        User.findOne({uniqueUserId: req.body.uniqueLikerId}, (err, user) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                Post.find({uniqueUserId: req.body.uniqueLikerId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        res.status(200).json({user: user, posts: posts, likeType: 'like'});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            Post.findOne({uniquePostId: req.body.uniquePostId}, (err, post) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    let comment = _.find(post.comments, comment => comment.uniqueCommentId === req.body.commentId);
                    comment.likes = _.reject(comment.likes, like => like === req.body.uniqueLikerId);
                    post.save(err => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.updateOne({uniqueUserId: req.body.uniqueCommenterId}, {$inc: {karma: -1}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.findOne({uniqueUserId: req.body.uniqueLikerId}, (err, user) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            Post.find({uniqueUserId: req.body.uniquePostPosterId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    res.status(200).json({user: user, posts: posts, likeType: 'unlike'});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            })
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error when a user tried to like a post');
        res.status(500).send('error');
    }
});
//----------------------------------------------------------------------------------------------------

//The route below will handle deleting a post 
router.route('/api/delete/post').post((req, res) => {
    try {
        Post.deleteOne({uniquePostId: req.body.uniquePostId}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(req.body.communityPost) {
                    Post.find({community: req.body.community, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({user: user, posts: posts});
                                }
                            });
                        }
                    });
                }
                else {
                    Post.find({uniqueUserId: req.body.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({user: user, posts: posts});
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log('There was an error deleting a post');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------

//The route below will specifically delete a media post (video or photo)
router.route('/api/delete/media/post').post((req, res) => {
    try {
        Post.deleteOne({uniquePostId: req.body.uniquePostId}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                
                gfs.remove({ filename: req.body.filename, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                        console.log('Error deleting file from GridFs when user tried to delete a media post');
                        console.log(err);
                        res.status(500).send('error');
                    }
                    else {
                        if(req.body.communityPost) {
                            Post.find({community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            res.status(200).json({user: user, posts: posts});
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            Post.find({uniqueUserId: req.body.uniqueUserId, context: req.body.community ? 'community' : 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            res.status(200).json({user: user, posts: posts});
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    catch(err) {
        console.log('There was an error deleting a post');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will handle uploading a photo to the database. It will also handle "videos"  
router.route('/api/upload/photo').post(uploads.single('photo'), (req, res) => {
    try {
        let newPost = new Post({
            uniquePostId: req.body.uniquePostId,
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
            utcTime: Date.now(),
            dateString: req.body.dateString,
            likes: [],
            comments: [],
            type: req.body.type,
            context: req.body.context,
            text: req.body.text,
            link: req.body.link,
            title: req.body.title,
            community: req.body.community,
            src: req.file.filename,
            privacy: req.body.privacy,
            caption: req.body.caption,
        });

        newPost.save(err => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(req.body.context === 'personal') {
                    Post.find({uniqueUserId: req.body.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({posts: posts});
                        }
                    });
                }
                else {
                    Post.find({community: req.body.community, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({posts: posts});
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log('There was an error uploading a media post.');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------

//The route below will retreive a geoUser from the database along with the mainUser who is visiting their page. 
router.route('/api/get/geo/user/:geoUserId/:mainUserId').get((req, res) => {
    try {
        //First we need to grab the geoUser from the database. 
        User.findOne({uniqueUserId: req.params.geoUserId}, (err, geoUser) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                //Grab the mainUser (user visiting the profile page)
                User.findOne({uniqueUserId: req.params.mainUserId}, (err, mainUser) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        //Grab the geoUsers' posts.
                        Post.find({uniqueUserId: req.params.geoUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                //Now grab the communities the geoUser might be in 
                                Community.find({name: {$in: geoUser.communities}}, (err, communities) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        //Now, we need to grab user created events. 
                                        Event.find({uniqueUserId: req.params.geoUserId}, (err, events) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                res.status(200).json({mainUser: mainUser, geoUser: geoUser, posts: posts, communities: communities, events: events});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log('There was an error retreiving a geoUser when a mainUser tried to visit their page');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------------

//The route below is designed to fetch GeoUsers from the database for the users who may not have signed up for an account, but want to view someone's public profile.
router.route('/api/get/public/geo/user/:uniqueUserId').get((req, res) => {
    try {
        User.findOne({uniqueUserId: req.params.uniqueUserId}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Post.find({uniqueUserId: req.params.uniqueUserId, context: 'personal'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        //Now grab the users' communities. 
                        Community.find({name: {$in: user.communities}}, (err, communities) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else if(!communities) {
                                console.log(`The communities are ${communities}`);
                                res.status(200).json({geoUser: user, posts: posts, communities: []});
                            }
                            else {
                                Event.find({uniqueUserId: req.params.uniqueUserId}, (err, events) => {
                                    if(err) {
                                        console.log(err.message);
                                    }
                                    else {
                                        console.log(`The communities are ${communities}`);
                                        res.status(200).json({geoUser: user, posts: posts, communities: communities, events: events});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log('There was an error getting a public geoUser for a user who is not logged in');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//----------------------------------------------------------------------------------------------------------

//The route below will handle fetching all users from the database. 
router.route('/api/fetch/users/:uniqueUserId').get((req, res) => {
    try {
        User.find({}, {}, {sort: {username: 1}}, (err, users) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                //Now fetch communities as well. 
                Community.find({}, {}, {sort: {name: 1}}, (err, communities) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({users: users, communities: communities});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will be responsible for fetching a community and posts associated with that community. 
router.route('/api/fetch/community/:communityName').get((req, res) => {
    try {
        Post.find({community: req.params.communityName, context: 'community'}, {}, {sort: {utcTime: -1}}, (err, posts) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                //Now find the specific community. 
                Community.findOne({name: req.params.communityName}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else if(!community) {
                        User.find({}, (err, users) => {
                            if(err) {
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({posts: posts, community: null, allUsers: users});
                            }
                        });
                    }
                    else {
                        User.find({}, (err, users) => {
                            if(err) {
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({posts: posts, community: community, allUsers: users});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error fetching a community!');
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------------

//The route below will handle following a user 
router.route('/api/follow/user').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {followers: {username: req.body.username, uniqueUserId: req.body.uniqueFollowerId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                User.updateOne({uniqueUserId: req.body.uniqueFollowerId}, {$push: {following: {username: req.body.followUsername, uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let newNotification = {
                            sender: req.body.username,
                            date: Date.now(),
                            msg: `${req.body.username} followed you.`,
                            type: 'new follower',
                            uniqueSenderId: req.body.uniqueFollowerId,
                            link: `/geouser/${req.body.uniqueFollowerId}`,
                            uniqueNotificationId: 'follower' + 'new' + Date.now() + req.body.uniqueFollowerId,
                        };

                        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {notifications: newNotification}}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.statusMessage(500).send('error');
                                    }
                                    else {
                                        res.status(200).json({geoUser: user});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error when a user tried to follow another user.');
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------

//The route below will handle when a user has to accept or reject a follow request. 
router.route('/api/follow/request/choice').post((req, res) => {
    try {
        if(req.body.accept === true) {
            User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {followers: {username: req.body.followerUsername, uniqueUserId: req.body.followerUniqueUserId}}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {notifications: {uniqueNotificationId: req.body.uniqueNotificationId}}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            let newNotification = {
                                sender: req.body.username,
                                date: Date.now(),
                                msg: `${req.body.username} accepted your follow request.`,
                                type: 'accept follow request',
                                link: `/geouser/${req.body.uniqueUserId}`,
                                uniqueSenderId: req.body.uniqueUserId,
                                uniqueNotificationId: Date.now() + 'acceptedrequest' + req.body.uniqueUserId + req.body.followerUniqueUserId,
                            };

                            User.updateOne({uniqueUserId: req.body.followerUniqueUserId}, {$push: {notifications: newNotification}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.updateOne({uniqueUserId: req.body.followerUniqueUserId}, {$push: {following: {username: req.body.username, uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    res.status(200).json({user: user, accept: true});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {notifications: {uniqueNotificationId: req.body.uniqueNotificationId}}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({user: user, accept: false});
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error accepting or rejecting a follower request');
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------

//The route below will handle sending a user a follow request if their profile is private.
router.route('/api/follow/user/request').post((req, res) => {
    try {
        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                let notificationSent = _.find(user.notifications, notification => notification.uniqueSenderId === req.body.followerUniqueUserId && notification.type === 'follower request');
                if(notificationSent) {
                    res.status(200).send('duplicate');
                }
                else {
                    let newNotification = {
                        sender: req.body.followerUsername,
                        date: Date.now(),
                        msg: `${req.body.followerUsername} sent you a follow request.`,
                        type: 'follower request',
                        uniqueSenderId: req.body.followerUniqueUserId,
                        uniqueNotificationId: Date.now() + 'followerrequest' + req.body.followerUniqueUserId,
                        link: '',
                    };
                    user.notifications.push(newNotification);
                    user.save((err, updatedUser) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({geoUser: updatedUser});
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error when a user tried to send a follow request');
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------

//The route below will handle unfollowing a user.
router.route('/api/unfollow/user').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {followers: {username: req.body.username, uniqueUserId: req.body.uniqueUnfollowerId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                User.updateOne({uniqueUserId: req.body.uniqueUnfollowerId}, {$pull: {following: {username: req.body.unfollowUsername, uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({geoUser: user});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error unfollowing a user.');
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will handle deleting a notification.
router.route('/api/delete/notification').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {notifications: {uniqueNotificationId: req.body.uniqueNotificationId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({link: req.body.link, user: user});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error deleting a notification!');
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------

//The route below will return a geoUser so that we can get their list of followers. 
router.route('/api/get/geo/followers/:uniqueUserId').get((req, res) => {
    try {
        User.findOne({uniqueUserId: req.params.uniqueUserId}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(!user) {
                res.status(200).json({geoUser: null});
            }
            else {
                res.status(200).json({geoUser: user});
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error getting the followers for a user when their page was visited!');
        res.status(500).send('error');
    }
});
//-----------------------------------------------------------------------------------------------------

//The route below will handle building a community and storing it in the database. 
router.route('/api/build/community').post(uploads.single('avatar'), (req, res) => {
    try {
        Community.findOne({name: req.body.name}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(result) {
                res.status(200).send('name taken');
            }
            else {
                let newCommunity = new Community({
                    name: req.body.name,
                    title: req.body.title,
                    topics: req.body.topics.split(','),
                    communityTheme: req.body.communityTheme,
                    description: req.body.description,
                    avatar: req.file.filename,
                    moderator: {
                        username: req.body.username,
                        uniqueUserId: req.body.uniqueUserId,
                    },
                    ratings: [],
                    rating: 0,
                    rules: [],
                    chatRoom: {
                        name: `${req.body.name} community chat`,
                        community: req.body.name,
                        title: req.body.title,
                        messages: [],
                    },
                    members: [
                        {
                            username: req.body.username,
                            uniqueUserId: req.body.uniqueUserId,
                        },
                    ],
                    communityPrivacy: 'public',
                    createdOn: req.body.createdOn,
                });

                newCommunity.save(err => {
                    if(err) {
                        console.log(err.message);
                    }
                    else {
                        //Add the community name to the moderators list of communities. 
                        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {communities: req.body.name}}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                //TODO: send the community name to re-route the user to this page. 
                                res.status(200).send(req.body.name);
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error building a GeoCities community!');
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------

//The route below will handle adding a user to the members in a public community. 
router.route('/api/public/join/community').post((req, res) => {
    try {
        Community.findOne({name: req.body.name}, (err, community) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                community.members.push({username: req.body.username, uniqueUserId: req.body.uniqueUserId});
                community.save((err, updatedCommunity) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {communities: req.body.name}}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({result: 'success', community: updatedCommunity});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('Error trying to join a public community');
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------

//The route below will handle sending a request to join a community. 
router.route('/api/community/join/request').post((req, res) => {
    try {
        User.findOne({uniqueUserId: req.body.moderatorUniqueUserId}, (err, moderator) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                let duplicate = _.find(moderator.notifications, notification => notification.type === 'community join request' && notification.uniqueSenderId === req.body.uniqueUserId);
                if(duplicate) {
                    res.status(200).send('duplicate');
                }
                else {
                    let newNotification = {
                        sender: req.body.username,
                        date: Date.now(),
                        msg: `${req.body.username} wants to join ${req.body.name}`,
                        type: 'community join request',
                        uniqueSenderId: req.body.uniqueUserId,
                        link: '',
                        uniqueNotificationId: Date.now() + 'notification' + 'communityjoin' + req.body.uniqueUserId + req.body.name,
                        community: req.body.name,
                    }

                    User.updateOne({uniqueUserId: req.body.moderatorUniqueUserId}, {$push: {notifications: newNotification}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).send('success');
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error sending a join request to a community');
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------

//The route below will handle accepting or rejecting a community join request. 
router.route('/api/accept/reject/community/join').post((req, res) => {
    try {
        if(req.body.acceptReject === true) {
            //This means that we have accepted the request. 
            let newUser = {
                username: req.body.username,
                uniqueUserId: req.body.uniqueUserId,
            };
            //Push object to community members. 
            Community.updateOne({name: req.body.name}, {$push: {members: newUser}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    //Now, delete the notification from the moderators notifications. 
                    User.updateOne({uniqueUserId: req.body.moderatorUniqueUserId}, {$pull: {notifications: {uniqueNotificationId: req.body.uniqueNotificationId}}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            //Create a notification to send to the user that their request has been accept. 
                            let newNotification = {
                                sender: req.body.moderatorUsername,
                                date: Date.now(),
                                msg: `You have been accepted to the ${req.body.name} community.`,
                                type: 'join accepted',
                                uniqueSenderId: req.body.moderatorUniqueUserId,
                                link: `/community/${req.body.name}`,
                                uniqueNotificationId: 'acceptedjoin' + Date.now() + req.body.username + req.body.uniqueUserId,
                                community: req.body.name,
                            };
                            User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {notifications: newNotification}}, (err, result) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    //Now we need to send the new community to the person joining. 
                                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {communities: req.body.name}}, (err, result) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            //Now send the mainUser/moderator back to the client. 
                                            User.findOne({uniqueUserId: req.body.moderatorUniqueUserId}, (err, user) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    res.status(200).json({user: user, acceptReject: true});
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            //We simply remove the notification fro the user notifications. 
            User.updateOne({uniqueUserId: req.body.moderatorUniqueUserId}, {$pull: {notifications: {uniqueNotificationId: req.body.uniqueNotificationId}}}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    //Now grab the user to send to client. 
                    User.findOne({uniqueUserId: req.body.moderatorUniqueUserId}, (err, user) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({user: user, acceptReject: false});
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error accepting or rejecting a community join request');
        res.status(500).send('error');
    }
});
//-----------------------------------------------------------------------------------------------------

//The route below will handle leaving a community. 
router.route('/api/leave/community').post((req, res) => {
    try {
        Community.updateOne({name: req.body.name}, {$pull: {members: {uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                //Now update the user and remove the community from their communities array. 
                User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {communities: req.body.name}}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        //Now send the community back. 
                        Community.findOne({name: req.body.name}, (err, community) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({community: community, result: 'success'});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error leaving a community');
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------

//The route below will handle adding a community text post to the database. 
router.route('/api/add/community/text/post').post((req, res) => {
    try {
        let newPost = new Post({
            uniquePostId: req.body.uniquePostId,
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
            community: req.body.community,
            dateString: req.body.dateString,
            title: req.body.title,
            privacy: req.body.privacy,
            utcTime: Date.now(),
            context: req.body.context,
            text: req.body.text ? req.body.text : '',
            type: req.body.type,
            likes: [],
            link: req.body.link ? req.body.link : '',
            caption: '',
            blockList: [],
            comments: [],
            src: '',
        });

        if(req.body.link) {
            let targetLink = 'https://meta.mehari.workers.dev/?url=' + req.body.link;
            axios.get(targetLink).then((response) => {
                let linkImage = response.data.image;
                let linkDescription = response.data.description;
                newPost.linkImage = linkImage;
                newPost.linkDescription = linkDescription;
                newPost.save(err => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        Post.find({context: 'community', community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({result: 'success', posts: posts, postType: 'link'});
                            }
                        });
                    }
                });
            });
        }
        else {
            newPost.save(err => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    Post.find({context: 'community', community: req.body.community}, {}, {sort: {utcTime: -1}}, (err, posts) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({result: 'success', posts: posts, postType: 'text'});
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        console.log('There was an error adding a community text post');
        res.status(500).send('error');
    }
});
//------------------------------------------------------------------------------------------------------
//The route below will handle deleting a message from a chatroom. We need the community and uniqueMessageId as our arguments. 
router.route('/api/delete/chat/msg').post((req, res) => {
    try {
        Community.findOne({name: req.body.community}, (err, community) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('erroe');
            }
            else {
                community.chatRoom.messages = _.reject(community.chatRoom.messages, msg => msg.uniqueMessageId === req.body.uniqueMessageId);
                community.save(err => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//----------------------------------------------------------------------------------------------------------------
//The route below will handle updating the community title. 
router.route('/api/update/community/title').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {title: req.body.title}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------
//The route below will handle updating the community description!
router.route('/api/update/community/description').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {description: req.body.description}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------------
//The route below will handle upating a new avatar for a community and deleting the old one. 
router.route('/api/update/community/avatar').post(uploads.single('avatar'), (req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {avatar: req.file.filename}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                
                gfs.remove({ filename: req.body.filename, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                        console.log('Error deleting file from GridFs when user tried to delete a media post');
                        console.log(err);
                        res.status(500).send('error');
                    }
                    else {
                        Community.findOne({name: req.body.community}, (err, community) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({community: community});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------------
//The route below will handle updating the community theme color 
router.route('/api/update/community/theme').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {communityTheme: req.body.theme}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------------------------
//The route below will handle updating the community privacy.
router.route('/api/update/community/privacy').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {communityPrivacy: req.body.communityPrivacy}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//----------------------------------------------------------------
//The route below will handle changing and updating the community topics. 
router.route('/api/update/community/topics').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$set: {topics: req.body.topics}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//-------------------------------------------------------------------------------------
//The route below will handle blocking a user from a community. 
router.route('/api/block/community/user').post((req, res) => {
    try {
        Community.findOne({name: req.body.community}, (err, community) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(_.find(community.blockList, user => user.uniqueUserId === req.body.uniqueUserId)) {
                    console.log(`In the block list we have ${community.blockList}`);
                    res.status(200).json({community: community});
                }
                else {
                    Community.updateOne({name: req.body.community}, {$push: {blockList: {username: req.body.username, uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {communities: req.body.community}}, (err, fin) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    Community.updateOne({name: req.body.community}, {$pull: {members: {uniqueUserId: req.body.uniqueUserId}}}, (err, din) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            res.status(200).json({community: community});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------
//The route below will handle unblocking a user from a community
router.route('/api/unblock/community/user').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$pull: {blockList: {uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------
//The route below will be responsible for deleting a rule from a community.
router.route('/api/delete/community/rule').post((req, res) => {
    try {
        Community.updateOne({name: req.body.community}, {$pull: {rules: {rule: req.body.rule}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------------------------------
//THe route below will handle adding a new rule to the community. 
router.route('/api/add/community/rule').post((req, res) => {
    try {
        let newRule = {
            rule: req.body.rule,
            reason: req.body.reason,
        };

        Community.updateOne({name: req.body.community}, {$push: {rules: newRule}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Community.findOne({name: req.body.community}, (err, community) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({community: community});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------
router.route('/api/change/username').post((req, res) => {
    try {
        //First test to see if the username is taken in DB.
        User.findOne({username: req.body.username}, (err, tester) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(tester) {
                res.status(200).send('username taken');
            }
            else {
                User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {username: req.body.username}}, (err, din) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).error
                            }
                            else {
                                res.status(200).json({user: user});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
})
//----------------------------------------------------------------------------------------------------------
//The route below will handle movin things --------------------------------------------------
router.route('/api/change/password').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {password: req.body.password}}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({user: result});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------
router.route('/api/change/email').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {email: req.body.email}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({user: user});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------
//The route below will handle updating the city of a user. 
router.route('/api/update/user/city').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {city: req.body.city}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//-------------------------------------------------------------------------------
//The code below will handle updating the users geographical state.
router.route('/api/update/user/state').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {userState: req.body.state}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//------------------------------------------------------------------------------
//The route below will handle updating the college of the user. 
router.route('/api/update/user/college').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {college: req.body.college}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//-------------------------------------------------------------------------------
//The route below will handle updating a users interests
router.route('/api/update/user/interests').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {interests: req.body.interests}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//--------------------------------------------------------------------------------
//The route below will update a users' Twitter handle 
router.route('/api/update/user/twitter').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {twitterHandle: req.body.twitterHandle}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//--------------------------------------------------------------------------------
//The route below will handle updating a users Instagrom handle.
router.route('/api/update/user/instagram').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {instaHandle: req.body.instaHandle}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//-------------------------------------------------------------------------------
//THe route below will handle the user updating the link to their YouTube channel.
router.route('/api/update/user/youtube').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {youtubeChannel: req.body.youtubeChannel}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//--------------------------------------------------------------------------------
//The route below will handle updating a users' profile theme color.
router.route('/api/update/user/theme').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {profileTheme: req.body.profileTheme}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//----------------------------------------------------------------------------------
//The route below will handle updating the bio for a user.
router.route('/api/update/user/bio').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {bio: req.body.bio}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});
//---------------------------------------------------------------------------------
//The route below will handle deleting a users' avatar.
router.route('/api/update/user/avatar').post(uploads.single('avatar'), (req, res) => {
    try {
        
        gfs.remove({ filename: req.body.oldAvatar, root: 'uploads' }, (err, gridStore) => {
            if (err) {
                console.log('Error deleting file from GridFs when user tried to delete a media post');
                console.log(err);
                res.status(500).send('error');
            }
            else {
                User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {avatar: req.file.filename}}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({user: user});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log('Error updating users profile picture!');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will be responsible for updating the profile privacy of a user and their posts. 
router.route('/api/update/user/privacy').post((req, res) => {
    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$set: {profilePrivacy: req.body.privacy}}, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(500).end('error');
        }
        else {
            //Update each post that belongs to this user.
            Post.updateMany({uniqueUserId: req.body.uniqueUserId}, {$set: {privacy: req.body.privacy}}, (err, resutls) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            res.status(200).json({user: user});
                        }
                    });
                }
            });
        }
    });
});
//---------------------------------------------------------------------------------
//The route below will handle allowoing a GeoUser to block another GeoUser.
router.route('/api/update/user/block').post((req, res) => {
    try {
        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                if(_.find(user.blockList, bUser => bUser.uniqueUserId === req.body.blockUniqueUserId)) {
                    res.status(200).json({user: user});
                }
                else if(req.body.blockUniqueUserId === req.body.uniqueUserId) {
                    res.status(200).send('yourself');
                }
                else {
                    let newBlock = {
                        uniqueUserId: req.body.blockUniqueUserId,
                        username: req.body.username,
                    };

                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$push: {blockList: newBlock}}, (err, result) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            Post.updateMany({uniqueUserId: req.body.uniqueUserId}, {$push: {blockList: newBlock}}, (err, resulty) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {followers: {uniqueUserId: req.body.blockUniqueUserId}}}, (err, resultgkg) => {
                                        if(err) {
                                            console.log(err.message);
                                            res.status(500).send('error');
                                        }
                                        else {
                                            User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {following: {uniqueUserId: req.body.blockUniqueUserId}}}, (err, resultx) => {
                                                if(err) {
                                                    console.log(err.message);
                                                    res.status(500).send('error');
                                                }
                                                else {
                                                    User.updateOne({uniqueUserId: req.body.blockUniqueUserId}, {$pull: {following: {uniqueUserId: req.body.uniqueUserId}}}, (err, resultb) => {
                                                        if(err) {
                                                            console.log(err.message);
                                                            res.status(500).send('error');
                                                        }
                                                        else {
                                                            User.updateOne({uniqueUserId: req.body.blockUniqueUserId}, {$pull: {followers: {uniqueUserId: req.body.uniqueUserId}}}, (err, resultq) => {
                                                                if(err) {
                                                                    console.log(err.message);
                                                                    res.status(500).send('error');
                                                                }
                                                                else {
                                                                    User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                                                                        if(err) {
                                                                            console.log(err.message);
                                                                            res.status(500).send('error');
                                                                        }
                                                                        else {
                                                                            res.status(200).json({user: user});
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will handle unblocking a user. 
router.route('/api/update/user/unblock').post((req, res) => {
    try {
        User.updateOne({uniqueUserId: req.body.uniqueUserId}, {$pull: {blockList: {uniqueUserId: req.body.blockUniqueUserId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Post.updateMany({uniqueUserId: req.body.uniqueUserId}, {$pull: {blockList: {uniqueUserId: req.body.blockUniqueUserId}}}, (err, resulty) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        User.findOne({uniqueUserId: req.body.uniqueUserId}, (err, user) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({user: user});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
})
//---------------------------------------------------------------------------------
//The route below will fetch all users, the threads the user is in, and the user 
router.route('/api/get/threads/:uniqueUserId').get((req, res) => {
    try {
        User.findOne({uniqueUserId: req.params.uniqueUserId}, (err, user) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Thread.find({}, (err, threads) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let myThreads = _.filter(threads, curThread => curThread.uniqueUserIds.includes(req.params.uniqueUserId));
                        myThreads = _.sortBy(myThreads, thread => -thread.utcTime);
                        User.find({}, (err, users) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                res.status(200).json({user: user, users: users, threads: myThreads});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will add a direct message to the database and either create a thread or append a message to one.
router.route('/api/add/dm').post((req, res) => {
    try {
        //Check to see if the message was made in a new compose dialog.
        if(req.body.freshMsg) {
            Thread.find({}, (err, threads) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    //Check to see if the uniqueUserId of the sender and receiver are in a thread. 
                    let mainThread = _.find(threads, thread => thread.uniqueUserIds.includes(req.body.senderUniqueUserId) && thread.uniqueUserIds.includes(req.body.receiverUniqueUserId));
                    if(mainThread) {
                        let newMsg = {
                            senderUniqueUserId: req.body.senderUniqueUserId,
                            receiverUniqueUserId: req.body.receiverUniqueUserId,
                            senderUsername: req.body.senderUsername,
                            receiverUsername: req.body.receiverUsername,
                            msg: req.body.msg,
                            utcTime: req.body.utcTime,
                            dateString: req.body.dateString,
                            uniqueMessageId: req.body.uniqueMessageId,
                        };

                        Thread.updateOne({uniqueThreadId: mainThread.uniqueThreadId}, {$push: {messages: newMsg}, utcTime: Date.now()}, (err, result) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                User.find({}, (err, users) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        //res.status(200).json({users: users, threads: returnThreads});
                                        //Return the threads that have now been updated. 
                                        Thread.find({}, (err, moreThreads) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                let returnThreads = _.filter(moreThreads, thread => thread.uniqueUserIds.includes(req.body.senderUniqueUserId));
                                                returnThreads = _.sortBy(returnThreads, thread => -thread.utcTime);
                                                res.status(200).json({users: users, threads: returnThreads});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        //We create a thread if we cannot find a thread with these users. 
                        let newMsg = {
                            senderUniqueUserId: req.body.senderUniqueUserId,
                            receiverUniqueUserId: req.body.receiverUniqueUserId,
                            senderUsername: req.body.senderUsername,
                            receiverUsername: req.body.receiverUsername,
                            msg: req.body.msg,
                            utcTime: req.body.utcTime,
                            dateString: req.body.dateString,
                            uniqueMessageId: req.body.uniqueMessageId,
                        };

                        let newThread = new Thread({
                            uniqueThreadId: Date.now() + req.body.senderUniqueUserId + req.body.receiverUniqueUserId + 'thread' + Date.now(),
                            usernames: [req.body.senderUsername, req.body.receiverUsername],
                            uniqueUserIds: [req.body.senderUniqueUserId, req.body.receiverUniqueUserId],
                            utcTime: Date.now(),
                            messages: [newMsg],
                        });

                        newThread.save(err => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                Thread.find({}, (err, threads) => {
                                    if(err) {
                                        console.log(err.message);
                                        res.status(500).send('error');
                                    }
                                    else {
                                        let returnThreads = _.filter(threads, thread => thread.uniqueUserIds.includes(req.body.senderUniqueUserId));
                                        returnThreads = _.sortBy(returnThreads, thread => -thread.utcTime);
                                        User.find({}, (err, users) => {
                                            if(err) {
                                                console.log(err.message);
                                                res.status(500).send('error');
                                            }
                                            else {
                                                Thread.find({}, (err, moreThreads) => {
                                                    if(err) {
                                                        console.log(err.message);
                                                        res.status(500).send('error');
                                                    }
                                                    else {
                                                        let returnThreads = _.filter(moreThreads, thread => thread.uniqueUserIds.includes(req.body.senderUniqueUserId));
                                                        returnThreads = _.sortBy(returnThreads, thread => -thread.utcTime);
                                                        res.status(200).json({users: users, threads: returnThreads});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            let newMsg = {
                senderUniqueUserId: req.body.senderUniqueUserId,
                receiverUniqueUserId: req.body.receiverUniqueUserId,
                senderUsername: req.body.senderUsername,
                receiverUsername: req.body.receiverUsername,
                msg: req.body.msg,
                utcTime: req.body.utcTime,
                dateString: req.body.dateString,
                uniqueMessageId: req.body.uniqueMessageId,
            };

            Thread.updateOne({uniqueThreadId: req.body.uniqueThreadId}, {$push: {messages: newMsg}, utcTime: Date.now()}, (err, result) => {
                if(err) {
                    console.log(err.message);
                    res.status(500).send('error');
                }
                else {
                    Thread.findOne({uniqueThreadId: req.body.uniqueThreadId}, (err, thread) => {
                        if(err) {
                            console.log(err.message);
                            res.status(500).send('error');
                        }
                        else {
                            User.find({}, (err, users) => {
                                if(err) {
                                    console.log(err.message);
                                    res.status(500).send('error');
                                }
                                else {
                                    res.status(200).json({users: users, thread: thread});
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will be responsible for grabbing an individual thread so that a user can send messages. 
router.route('/api/grab/thread/:uniqueThreadId/:uniqueUserId').get((req, res) => {
    try {
        Thread.findOne({uniqueThreadId: req.params.uniqueThreadId}, (err, thread) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else if(!thread) {
                console.log('Message thread not found');
                res.status(200).send('no thread');
            }
            else {
                User.findOne({uniqueUserId: req.params.uniqueUserId}, (err, user) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({user: user, thread: thread});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will handle deleting a message from a DM thread.
router.route('/api/delete/dm').post((req, res) => {
    try {
        Thread.updateOne({uniqueThreadId: req.body.uniqueThreadId}, {$pull: {messages: {uniqueMessageId: req.body.uniqueMessageId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Thread.findOne({uniqueThreadId: req.body.uniqueThreadId}, (err, thread) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).json({thread: thread});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will handle adding an event to the database. 
router.route('/api/create/event').post(uploads.single('img'), (req, res) => {
    try {
        let newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            timeString: req.body.timeString,
            dateString: req.body.dateString,
            utcTime: req.body.utcTime,
            utcTimeCreated: Date.now(),
            topics: req.body.topics.split(','),
            city: req.body.city,
            state: req.body.eventState,
            uniqueEventId: req.body.uniqueEventId,
            username: req.body.username,
            uniqueUserId: req.body.uniqueUserId,
            src: req.file.filename,
            likes: [],
            attending: [{
                uniqueUserId: req.body.uniqueUserId,
                username: req.body.username,
            }],
        }).save(err => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                res.status(200).send('success');
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will be responsible for fetching events from the GeoCities database!
router.route('/api/fetch/events').get((req, res) => {
    try {
        Event.find({}, {}, {$sort: {utcTime: 1}}, (err, events) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                console.log(`Returning the events: ${events}`);
                let newEvents = _.sortBy(events, event => -event.utcTime);
                res.status(200).json({events: newEvents});
            }
        });
    }
    catch(e) {
        console.log(e.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below is responsible for unliking an event. 
router.route('/api/unlike/event').post((req, res) => {
    try {
        Event.updateOne({uniqueEventId: req.body.uniqueEventId}, {$pull: {likes: {uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Event.find({}, (err, events) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let newEvents = _.sortBy(events, event => -event.utcTime);
                        res.status(200).json({events: newEvents});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will handle liking an event 
router.route('/api/like/event').post((req, res) => {
    try {
        let newLiker = {
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
        };

        Event.updateOne({uniqueEventId: req.body.uniqueEventId}, {$push: {likes: newLiker}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Event.find({}, (err, events) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let newEvents = _.sortBy(events, event => -event.utcTime);
                        res.status(200).json({events: newEvents});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will enable a user to attend an event. 
router.route('/api/attend/event').post((req, res) => {
    try { 
        let newAttender = {
            uniqueUserId: req.body.uniqueUserId,
            username: req.body.username,
        };

        Event.updateOne({uniqueEventId: req.body.uniqueEventId}, {$push: {attending: newAttender}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Event.find({}, (err, events) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let newEvents = _.sortBy(events, event => -event.utcTime);
                        res.status(200).json({events: newEvents});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will allow a user to unattend an event if they don't want to go anymore. 
router.route('/api/unattend/event').post((req, res) => {
    try {
        Event.updateOne({uniqueEventId: req.body.uniqueEventId}, {$pull: {attending: {uniqueUserId: req.body.uniqueUserId}}}, (err, result) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                Event.find({}, (err, events) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        let newEvents = _.sortBy(events, event => -event.utcTime);
                        res.status(200).json({events: newEvents});
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//This route will handle deleting an event and the associated media image from the database. 
router.route('/api/delete/event').post((req, res) => {
    try {
        
        gfs.remove({ filename: req.body.file, root: 'uploads' }, (err, gridStore) => {
            if (err) {
                console.log('Error deleting file from GridFs when user tried to delete a media post');
                console.log(err);
                res.status(500).send('error');
            }
            else {
                Event.deleteOne({uniqueEventId: req.body.uniqueEventId}, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        Event.find({}, (err, events) => {
                            if(err) {
                                console.log(err.message);
                                res.status(500).send('error');
                            }
                            else {
                                let newEvents = _.sortBy(events, event => -event.utcTime);
                                res.status(200).json({events: events});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
//The route below will get a users' posts for the feed. 
router.route('/api/get/user/feed/posts/:uniqueUserId').get((req, res) => {
    try {
        Post.find({}, {}, {sort: {utcTime: -1}}, (err, posts) => {
            if(err) {
                console.log(err.message);
                res.status(500).send('error');
            }
            else {
                console.log(`The posts are: ${posts}`);
                console.log('Posts sending!');
                res.status(200).json({posts: posts});
            }
        });
    }
    catch(err) {
        console.log('Error sending posts!');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//--------------------------------------------------------------------------------
//The route below will get feed posts for a non user 
router.route('/api/get/nonuser/feed/posts').get((req, res) => {
    try {
        Post.find({}, {}, {sort: {utcTime: -1}}, (err, posts) => {
            if(err) {
                console.log(err.messasge);
                console.log('Error sending feed posts to non-user');
                res.status(500).send('error');
            }
            else {
                console.log('We are sending posts for a non-user!');
                res.status(200).json({posts: posts});
            }
        });
    }
    catch(err) {
        console.log('Error sending posts for a non-user!');
        console.log(err.message);
        res.status(500).send('error');
    }
});
//---------------------------------------------------------------------------------
module.exports = router;