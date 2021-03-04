/* ---------- MODULES ---------- */
const express = require('express');

/* ---------- CLASSES & INSTANCES ---------- */
const router = express.Router();
const passportTwitter = require('../auth/twitter');

/* ---------- CONSTANTS ---------- */

/* ---------- FUNCTIONS  ---------- */

/* ---------- INITIALIZATION ---------- */

/* ---------- ROUTES ---------- */
router.get('/twitter', passportTwitter.authenticate('twitter'));

router.get('/twitter/callback',
    passportTwitter.authenticate('twitter', {failureRedirect: '/'}),
    (req, res) => {
        // Successful authentication
        const user = req.user;

        // res.json(req.user);
        req.session.loggedIn = true;
        req.session._id = user._id;
        req.session.name = `${user.firstName} ${user.lastName}`;

        res.redirect('/');
    });

module.exports = router;