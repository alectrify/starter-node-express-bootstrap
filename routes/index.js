/* ---------- MODULES ---------- */
const auth = require('../middleware/auth');
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');
const passport = require('passport');

/* ---------- CLASSES & INSTANCES ---------- */
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */
const DEV_MODE = process.env.LOGGED_IN === 'true'; // To automatically log in after server refresh
const DEV_USER_ID = process.env.DEV_USER_ID;

/* ---------- FUNCTIONS  ---------- */

/* ---------- INITIALIZATION ---------- */
/* ----- Express ----- */
router.use(function (req, res, next) {
    // Automatically authenticate if dev mode is on.
    if (!req.isAuthenticated() && DEV_MODE && DEV_USER_ID) {
        User.findById(DEV_USER_ID, (err, user) => {
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
/* ----- VISITOR ROUTES ----- */
router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/?login=fail'}));

router.get('/privacy', (req, res) => {
    res.render('privacy');
});

router.get('/tos', (req, res) => {
    res.render('tos');
});

/* ----- USER ROUTES ----- */
// GET '/' -
// With the middleware, if the user is not authenticated, they will be redirected to the front landing page.
router.get('/', auth.isLoggedIn, (req, res) => {
    res.render('users/dashboard', {user: req.user});
});

router.get('/logout', auth.isAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/settings', auth.isAuthenticated, (req, res) => {
    res.render('users/settings', {attempt: req.query.passwordChange});
});

module.exports = router;