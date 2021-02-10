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

// protected routed
router.get('/profile', loginCheck(), (req, res) => {
    res.render('profile', req.session.user);
});

module.exports = router;
