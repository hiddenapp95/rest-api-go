let {userIsAuthorizedTo,roles} = require("../roles/roles");
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let {exceptions} = require('../exceptions/exceptions');
let jwt = require('jsonwebtoken');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let User = require('./User');

// CREATES A NEW USER
router.post('/', async (req, res) => {

    // if(!userIsAuthorizedTo(roles.createUser,req.userRole))
    //     return res.status(403).send(exceptions.unAuthorized);

    try{
        const users = await User.find({email:req.body.email});

        if(users.length>0)
            return res.status(500).send(exceptions.userAlreadyRegistered);

        const newUser = await User.create({
                        email : req.body.email,
                        name : req.body.name,
                        userRole : req.body.userRole
                    });

        return res.send(newUser);
    }catch(e){
        return res.status(500).send(exceptions.defaultException);
    }
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {

    // if(!userIsAuthorizedTo(roles.getUsers,req.userRole))
    //     return res.status(403).send(exceptions.unAuthorized);

    User.find({}, function (err, users) {
        if (err) return res.status(500).send(exceptions.defaultException);
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
// router.get('/:id', function (req, res) {
//     User.findById(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem finding the user.");
//         if (!user) return res.status(404).send("No user found.");
//         res.status(200).send(user);
//     });
// });

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findOneAndDelete({_id:req.params.id}, function (err, user) {
        if (err) return res.status(500).send(exceptions.defaultException);
        res.status(200).send("OK");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send(exceptions.defaultException);
        res.status(200).send(user);
    });
});


module.exports = router;