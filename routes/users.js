/* ---------- MODULES ---------- */
const _ = require('lodash');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
const sharp = require('sharp');

/* ---------- CLASSES & INSTANCES ---------- */
const router = express.Router();
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */
const SIGNUP_EMAIL_MSG = {
    text: 'Welcome to ThinkCorp.',
    html: '<h1>Welcome to ThinkCorp.</h1>'
};

/* ---------- FUNCTIONS ---------- */

/* ---------- INITIALIZATION ---------- */
/* ----- SendGrid ------ */
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Store API_KEY in .env file

/* ----- Multer ----- */
const upload = multer({
    fileFilter: function (req, file, cb) {
        const fileTypes = /pjp|jpg|pjpeg|jpeg|jfif|png|webp/;
        const validMimeType = fileTypes.test(file.mimetype);

        if (validMimeType) {
            cb(null, true);
        }
        else {
            req.flash('dashboard', `File upload only supports ${fileTypes}. Head to the Profile page to try another upload.`);
            cb(null, false);
        }
    },

});

/* ---------- ROUTES ---------- */
// Get all users.
router.get('/', auth.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;

        res.json(users);
    });
});

// Create a user.
router.post('/', upload.single('profile'), async (req, res, next) => {
    let userObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };

    if (req.file) {
        userObj.profile = {photo: await sharp(req.file.buffer).resize(400, 400).toBuffer()};
    }

    const user = new User(userObj);

    user.save((err) => {
        // Check for invalid user input.
        if (err) {
            if (err.code === 11000) {
                // Email taken.
                req.flash('error', 'The email you entered is already registered!');
            }
            else {
                // Validation error (ex: invalid email)
                req.flash('error', err.message);
            }
            return res.status(409).redirect('/');
        }

        // Send email (requires SendGrid API key)
        /*sgMail.send({
            to: user.email,
            from: '',
            subject: 'Account confirmation: ThinkCorp',
            text: SIGNUP_EMAIL_MSG.text,
            html: SIGNUP_EMAIL_MSG.html
        }).then(() => {
        }, error => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        });*/

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
            user.verifyPassword(req.body.oldPassword, (err, success) => {
                if (success) {
                    user.password = req.body.newPassword;
                    user.save();
                    req.flash('settings', 'Password change succeeded!');
                }
                else {
                    req.flash('settings', 'Password change failed! Incorrect old password was entered.');
                }

                res.redirect('/settings');
            });
        }
        else {
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