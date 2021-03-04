const User = require('../models/UserModel'); //Import the user model for mongoose connectivity.

module.exports = function(req, res) {
    //First, get the username and password from the body of the request object from the post request.
    let username = req.body.username;
    let password = req.body.password;

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
                        res.status(200).send('success'); 
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
};