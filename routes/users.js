/* ---------- MODULES ---------- */
const _ = require('lodash');
const chalk = require('chalk');
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');

/* ---------- INSTANCES ---------- */
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */
const LOGGING = true;

/* ---------- FUNCTIONS ---------- */
function logCall(route) {
    if (LOGGING) {
        console.log(chalk.yellow(`- API Call: ${route} at ${new Date().toUTCString()}`));
    }
}

/* ---------- INITIALIZATION ---------- */

/* ---------- ROUTES ---------- */
// Get all users.
router.get('/', (req, res) => {
    logCall(`${req.method} ${req.route.path}`);

    User.find({}, (err, users) => {
        if (err) throw err;

        res.json(users);
    });
});

// Create a user.
router.post('/', (req, res) => {
    logCall(`${req.method} ${req.route.path}`);

    const fields = [req.body.firstName, req.body.lastName, req.body.email, req.body.password];

    const [firstName, lastName, email, password] = _.map(fields, DOMPurify.sanitize);

    const user = new User({
        firstName,
        lastName,
        email,
        password
    });

    user.save((err) => {
        if (err) throw err;

        req.session.loggedIn = true;
        req.session._id = user._id;
        req.session.name = `${user.firstName} ${user.lastName}`;

        res.redirect('/');
    });
});

// Delete currently logged in user.
router.delete('/', (req, res) => {
    logCall(`${req.method} ${req.route.path}`);

    if (req.session._id) {
        User.findByIdAndDelete(req.session._id, (err) => {
            if (err) console.error(err);

            res.redirect('/logout');
        });
    } else {
        res.redirect('/');
    }
});

// Get a specific user.
router.get('/:id', (req, res) => {
    logCall(`${req.method} ${req.route.path}`);

    User.findById(req.params.id, (err, user) => {
        if (err) throw err;

        res.json(user);
    });
});

// Delete a specific user.
router.delete('/:id', (req, res) => {
    logCall(`${req.method} ${req.route.path}`);

    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) throw err;

        res.redirect('/');
    });
});

module.exports = router;