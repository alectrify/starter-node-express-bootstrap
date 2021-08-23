/* ---------- CONSTANTS ---------- */
const DEV_VIEW_MODE = process.env.DEV_VIEW_MODE; // ['admin', 'user', 'visitor']

/* ---------- CLASSES & INSTANCES ---------- */
const Post = require('../models/Post');

/* ---------- FUNCTIONS ---------- */
let authObj = {};

/* ----- Authentication ----- */
authObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.render('landing', {flash: req.flash('error')});
    }
};

authObj.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(404);
        res.render('404', {flash: req.flash('error')});
    }
};

authObj.isAdmin = (req, res, next) => {
    if (DEV_VIEW_MODE === 'admin' || (req.isAuthenticated() && req.user.plan === 'Admin')) {
        next();
    } else {
        res.status(404);
        res.render('404');
    }
};

/* ----- Authorization ----- */
authObj.isPostAuthor = (req, res, next) => {
    Post.findById(req.params.id, (err, post) => {
        if (post.author.equals(req.user._id)) {
            next();
        } else {
            res.status(404);
            res.render('404', {user: req.user});
        }
    });
};

module.exports = authObj;