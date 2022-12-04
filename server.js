const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const mongoose = require('./database/mongoose');//This import will start the mongoose connection.
const requireMongoose = require('mongoose');
const querystring = require('querystring');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const http = require('http');
const axios = require('axios');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sslRedirect = require('heroku-ssl-redirect');
const routes = require('./routes/routes');
const Community = require('./models/CommunityModel');

app.set('port', process.env.PORT || 3001); //Either listen on process.env.PORT or port 3001.
app.set('appName', 'GeoCities'); //Set the name of the application to "Excite".

app.use(session({secret: '1940gjjnjfnsb', resave: true, saveUninitialized: true, cookie: {maxAge: 3600000}})); //Create a session when the user visits the proper URL. Set the cookie age to 1 hour or 3,600,000 milliseconds.
app.use(cookieParser()); //Use the cookie parser to help with managing sessions. 
app.use(logger('dev')); //Use the logger in development environments 
app.use(errorHandler());
app.use(bodyParser.json()); //Use JSON within the body parser to process requests.
app.use(bodyParser.urlencoded({extended: true})); //Use body parser to parse requests.
app.use(cors()); //Use cors to prevent http request conflicts.
app.use(sslRedirect.default()); //Redirect all visits to https for security and PWA purposes. 
app.use(serveStatic(__dirname + '/build'));
//Create the history api fallback to prevent routing issues with react-router-dom. 
app.use(history({
    rewrites: [
        {
            from: /^\/api\/.*$/,
            to: function(context) {
                return context.parsedUrl.path;
            }
        }
    ]
}));



//Now get express "app" to "use" each route within the routes folder.
//app.use('/', loginRoute); //This is the route that will verify a user based on their username and password.
//app.use(signupRoute); //This is the route that will save a new user to the database.
app.use('/', routes);
//Use a wildcard below to serve the static path in the build folder for all unmatched routes. 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//The code below will prevent the process from exiting and freezing the app on an error.
process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`)
});

const server = http.createServer(app).listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});

const io = require('socket.io').listen(server);

io.on('connection', socket => {
    console.log(`Connected to socket: ${socket.id}`);

    //This will handle a disconnection for us. 
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected!`);
    });

    //This will handle a new user joining a room. 
    socket.on('joinRoom', data => {
        console.log(`${data.username} has joined ${data.room} chat`);
        let room = data.room;
        socket.join(room);
        io.to(room).emit('userJoined', {
            username: data.username,
        });
    });

    //This will handle sending a message to the clients within a room once we receive it on the server.
    socket.on('sendMsg', data => {
        Community.findOne({name: data.community}, (err, community) => {
            if(err) {
                console.log(err.message);
            }
            else {
                console.log(`The community is: ${community}`);
                community.chatRoom.messages.push(data);
                community.save(err => {
                    if(err) {
                        console.log(err.message);
                    }
                    else {
                        io.to(data.community).emit('newMsg', community);
                    }
                });
            }
        });
    });
});