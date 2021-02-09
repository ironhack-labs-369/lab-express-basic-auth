const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// Sign Up
router.get('/signup', (req, res, next) => {
    res.render('signup');
});
// sign up form posts to this route
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log('', username, password);

    // is pw longer than 8 ch and username !== empty
    // if not show the signup again
    if (password.length < 8) {
        res.render('signup', { message: 'Your password must be 8 character)' });
    }

    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty)' });
    }

    // check if username already exist
    User.findOne({ username: username })
        // if yes show the signup again with a message
        .then((user) => {
            if (user !== null) {
                res.render('signup', { message: 'Username is already taken)' });
            } else {
                // if pass --> create new user in DB with hashed pw
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                // create user in DB
                User.create({
                    username,
                    password: hash,
                }).then((user) => {
                    console.log(user);
                    // redirect to login (not there yet)
                    res.redirect('/');
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
