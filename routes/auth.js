const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// Sign Up
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

// Log in
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // check if username matches
    User.findOne({ username: username }).then((userDB) => {
        if (userDB === null) {
            res.render('login', { message: 'Invalid credentials' });
            return;
        }
        // if username exists I check the password
        if (bcrypt.compareSync(password, userDB.password)) {
            // password & hash match!!
            req.session.user = userDB;
            res.redirect('/profile');
        } else {
            res.render('login', {
                message: 'Invalid credentials',
            });
        }
    });
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
                    res.redirect('/profile');
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
