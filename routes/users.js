/* ---------- MODULES ---------- */
const _ = require('lodash');
const chalk = require('chalk');
const createDOMPurify = require('dompurify');
const express = require('express');
const {JSDOM} = require('jsdom');
const mongoose = require('mongoose');

/* ---------- CONSTANTS ---------- */
const DB_NAME = 'thinkcorpDB';
const DOMPurify = createDOMPurify(new JSDOM('').window); // Use DOMPurify.sanitize(dirty) on inputs
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/${DB_NAME}`;
const router = express.Router();

/* ---------- FUNCTIONS ---------- */
function logCall(route) {
    console.log(chalk.yellow(`- API Call: ${route} at ${new Date().toUTCString()}`));
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

/* ---------- ROUTES ---------- */
router.get('/', (req, res) => {
    logCall('GET /users');

    User.find({}, (err, users) => {
        if (err) throw err;

        res.json(users);
    });
});

router.post('/', (req, res) => {
    logCall('POST /users');

    const fields = [req.body.firstName, req.body.lastName, req.body.email, req.body.password];

    const [firstName, lastName, email, password] = _.map(fields, DOMPurify.sanitize)

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

router.delete('/', (req, res) => {
    logCall('DELETE /users');

    if (req.session._id) {
        User.findByIdAndDelete(req.session._id, (err) => {
            if (err) console.error(err);

            res.redirect('/logout');
        });
    } else {
        res.redirect('/');
    }
});

router.get('/:id', (req, res) => {
    logCall('GET /users/:id');

    User.findById(req.params.id, (err, user) => {
        if (err) throw err;

        res.json(user);
    });
});

router.put('/:id', (req, res) => {
    logCall('PUT /users/:id');
});


router.delete('/:id', (req, res) => {
    logCall('DELETE /users/:id');

    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) throw err;

        res.redirect('/logout');
    });
});

module.exports = router;