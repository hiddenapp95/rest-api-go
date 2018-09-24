let config = require("./config/config");
let express = require('express');
let app = express();
let db = require('./db');
let {exceptions} = require('./exceptions/exceptions');
let     cors = require('cors');

let corsOptions = {
    origin: 'http://localhost:8081',
    //origin: 'http://127.0.0.1:8887',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

let LogInController = require('./user/LogIn');
app.use('/logIn', LogInController);

// app.use(function verifyToken(req, res, next) {
//     var token = req.headers['x-access-token'];
//
//     if (!token)
//         return res.status(500).send(exceptions.noTokenProvided);
//     jwt.verify(token, config.secret, function(err, decoded) {
//         if (err)
//             return res.status(403).send(exceptions.invalidTokenProvided);
//         req.userId = decoded.userId;
//         req.userEmail = decoded.userEmail;
//         req.userRole = decoded.userRole;
//         next();
//     });
// });

const UserController = require('./user/UserController');
app.use('/users', UserController);


module.exports = app;