const express = require('express');
const router = express.Router();

// middleware to check logged in user
const loginCheck = () => {
    return (req, res, next) => {
        // if user is logged in proceed to the next step
        //otherwise redirect to /login
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    };
};

// home page
router.get('/', (req, res, next) => res.render('index'));

// protected routes

router.get('/main', loginCheck(), (req, res) => {
    res.redirect('/');
});
router.get('/private', loginCheck(), (req, res) => {
    res.render('profile', req.session.user);
});

module.exports = router;
