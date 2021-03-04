const express = require('express');
const router = express.Router();
const User = '../models/UserModel';
const uploads = require('../utils/multerUploader');

router.route('/api/signup').post(uploads.single('avatar'), (req, res) => {
    console.log('We triggered the sign up page with a post request');
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
                }; //Send a welcome message notification to the user. 
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
                    interests: req.body.interests,
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
                });

                //Now we need to save this user to the database. 
                newUser.save((err, user) => {
                    if(err) {
                        console.log(err.message);
                        res.status(500).send('error');
                    }
                    else {
                        res.status(200).send('success');
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

module.exports = router;