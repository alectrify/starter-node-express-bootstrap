/* ---------- MODULES ---------- */
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');

/* ---------- CLASSES & INSTANCES ---------- */
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */
const DEV_MODE = process.env.LOGGED_IN === 'true'; // To automatically log in after server refresh
const DEV_USER = {
    _id: process.env.DEV_USER_ID,
    name: 'Admin'
};

/* ---------- FUNCTIONS  ---------- */

/* ---------- INITIALIZATION ---------- */
/* ----- Express ----- */
router.use(function (req, res, next) {
    if (DEV_MODE) {
        req.session.loggedIn = true;
        req.session.name = DEV_USER.name;
    }

    next()
});

/* ---------- ROUTES ---------- */
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('users/dashboard', {name: req.session.name});
    } else {
        res.render('landing', {attempt: req.query.attempt});
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findByCredentials(req.body.email, req.body.password);

    if (!user) {
        res.status(401).redirect('/?attempt=fail'); // 401 = failed authentication
    } else {
        req.session.loggedIn = true;
        req.session._id = user._id;
        req.session.name = `${user.firstName} ${user.lastName}`;

        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/');
});

router.get('/settings', (req, res) => {
    if (req.session.loggedIn) {
        res.render('users/settings');
    } else {
        res.render('landing');
    }
});

module.exports = router;