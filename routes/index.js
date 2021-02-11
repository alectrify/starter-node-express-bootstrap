/* ---------- MODULES ---------- */
const chalk = require('chalk');
const createDOMPurify = require('dompurify');
const express = require('express');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');

/* ---------- CUSTOM MODULES ---------- */

/* ---------- CONSTANTS ---------- */
const DEV_MODE = false;
const DB_NAME = 'thinkcorpDB';
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/${DB_NAME}`;
const router = express.Router();

/* ---------- FUNCTIONS  ---------- */
function logCall(route) {
    console.log(chalk.yellow.bold(`Webpage Call: ${route} at ${new Date().toUTCString()}`));
}

/* ---------- INITIALIZATION ---------- */
/* ----- Mongoose ----- */
mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((err) => console.log(err));
const User = require('../models/User');

/* ---------- REQUEST METHODS ---------- */
router.get('/', (req, res) => {
    logCall(req.route.path);

    if (req.session.loggedIn || DEV_MODE) {
        if (DEV_MODE) {
            req.session.name = 'Admin';
        }

        res.render('dashboard', {name: req.session.name});
    } else {
        res.render('landing', {attempt: req.query.attempt});
    }
});

router.post('/login', async (req, res) => {
    logCall(req.route.path);

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
    logCall(req.route.path);

    req.session.destroy();

    res.redirect('/');
});

router.get('/settings', (req, res) => {
    logCall(req.route.path);

    if (req.session.loggedIn || DEV_MODE) {
        if (DEV_MODE) {
            req.session.name = 'Admin';
        }

        res.render('settings');
    } else {
        res.render('landing');
    }
});

module.exports = router;