let express = require('express');
let router = express.Router();
let {exceptions} = require('../exceptions/exceptions');
let User = require('./User');
let config = require('../config/config');

let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', async function (req, res) {

    if(!req.body.token)
        return res.status(500).send(exceptions.defaultException);

    try{
        const r = await client.verifyIdToken({
            idToken: req.body.token,
            audience: "570528584266-37h6vgnurg3n6t135ad1uqatp7neeuq0.apps.googleusercontent.com" });

        if(!r || !r.payload.email || !r.payload.name) return res.status(500).send(exceptions.googleDataError);

        User.findOne({ userEmail: r.payload.email }, (err, user) => {
            if (err) return res.status(500).send(exceptions.defaultException);
            if (!user) return res.status(500).send(exceptions.userNotRegistered);

            let token = jwt.sign({ userId: user._id ,userRole: user.role, userEmail:user.email},config.secret,{  expiresIn: 86400 });
            return res.status(200).send({ token: token, user:{name: user.name, email: user.email, role: user.role }});
        });

    }catch(e){
        return res.status(500).send(exceptions.defaultException);
    }
});

module.exports = router;