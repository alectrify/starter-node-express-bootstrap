/* ---------- MODULES ---------- */
const auth = require('../middleware/auth');
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');
const passport = require('passport');

/* ---------- CLASSES & INSTANCES ---------- */
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */
const DEV_MODE = process.env.LOGGED_IN === 'true'; // To automatically log in after server refresh
const DEV_USER = {
    _id: process.env.DEV_USER_ID // SET THIS FOR FUNCTIONAL DEV_MODE
};

/* ---------- FUNCTIONS  ---------- */

/* ---------- INITIALIZATION ---------- */
/* ----- Express ----- */
router.use(function (req, res, next) {
    if (DEV_MODE) {
        User.findById(DEV_USER._id, (err, user) => {
            if (err) throw err;

            req.login(user, (err) => {
                if (err) return next(err);

                return next();
            });
        });
    } else {
        next();
    }
});

/* ---------- ROUTES ---------- */
router.get('/', auth.isLoggedIn, (req, res) => {
    res.render('users/dashboard', {user: req.user});
});

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/?login=fail'}));

router.get('/logout', auth.isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/settings', auth.isAuthenticated, (req, res) => {
    res.render('users/settings', {attempt: req.query.passwordChange});
});

module.exports = router;