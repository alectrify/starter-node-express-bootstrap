/* ---------- MODULES ---------- */
const _ = require('lodash');
const auth = require('../middleware/auth');
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');

/* ---------- CLASSES & INSTANCES ---------- */
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */

/* ---------- FUNCTIONS ---------- */

/* ---------- INITIALIZATION ---------- */

/* ---------- ROUTES ---------- */
// Get all users.
router.get('/', auth.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;

        res.json(users);
    });
});

// Create a user.
router.post('/', (req, res, next) => {
    const fields = [req.body.firstName, req.body.lastName, req.body.email, req.body.password];

    const [firstName, lastName, email, password] = _.map(fields, DOMPurify.sanitize);

    const user = new User({
        firstName,
        lastName,
        email,
        password
    });

    user.save((err) => {
        if (err) return res.status(409).redirect('/?login=username+taken');

        req.login(user, (err) => {
            if (err) return next(err);

            return res.redirect('/');
        });
    });
});

// Edit currently logged in user.
router.put('/', auth.isAuthenticated, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) console.error(err);

        // If password change attempt:
        if (req.body.oldPassword) {
            user.verifyPassword(req.body.oldPassword, (err, result) => {
                if (result) {
                    user.password = req.body.newPassword;
                    user.save();
                    res.redirect('/settings?passwordChange=success');
                } else {
                    res.redirect('/settings?passwordChange=fail');
                }
            });
        } else {
            res.redirect('/');
        }
    });
});


// Delete currently logged in user.
router.delete('/', auth.isAuthenticated, (req, res) => {
    User.findByIdAndDelete(req.user._id, (err) => {
        if (err) console.error(err);

        res.redirect('/logout');
    });
});

// Get a specific user.
router.get('/:id', auth.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) throw err;

        res.json(user);
    });
});

// Delete a specific user.
router.delete('/:id', auth.isAdmin, (req, res) => {
    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) throw err;

        res.redirect('/');
    });
});

module.exports = router;