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

app.set('port', process.env.PORT || 3001); //Either listen on process.env.PORT or port 3001.
app.set('appName', 'GeoCities'); //Set the name of the application to "Excite".

app.use(session({secret: '1940gjjnjfnsb', resave: true, saveUnitialized: true, cookie: {maxAge: 3600000}})); //Create a session when the user visits the proper URL. Set the cookie age to 1 hour or 3,600,000 milliseconds.
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

const server = http.createServer(app);
const start = server.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});

//The code below will prevent the process from exiting and freezing the app on an error.
process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`)
});