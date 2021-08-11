/* ---------- MODULES ---------- */
const _ = require('lodash');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

/* ---------- CLASSES & INSTANCES ---------- */
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

/* ---------- CONSTANTS ---------- */

/* ---------- FUNCTIONS ---------- */

/* ---------- INITIALIZATION ---------- */
/* ----- Multer ----- */
const upload = multer({
    fileFilter: function (req, file, cb) {
        const fileTypes = /pjp|jpg|pjpeg|jpeg|jfif|png|webp/;
        const validMimeType = fileTypes.test(file.mimetype);

        if (validMimeType) {
            cb(null, true);
        }
        else {
            req.flash('posts', `File upload only supports ${fileTypes}. Try again with a valid file type.`);
            cb(null, false);
        }
    },

});

/* ---------- ROUTES ---------- */
// Get all users.
router.get('/', auth.isAuthenticated, (req, res) => {
    Post.find({}).populate('author').exec((err, posts) => {
        if (err) throw err;

        res.render('users/posts', {posts, user: req.user, flash: req.flash('posts')});
    });
});

// Create a user.
router.post('/', auth.isAuthenticated, upload.single('image'), async (req, res, next) => {
    let postObj = {
        author: req.user._id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    };

    if (req.file) {
        postObj.image = await sharp(req.file.buffer).resize(400, 400).toBuffer();
    }

    const post = new Post(postObj);

    post.save((err) => {
        // Check for invalid user input.
        if (err) {
            req.flash('posts', err.message);
            return res.status(409).redirect('/posts');
        }

        return res.redirect('/posts');
    });
});

// Get all users.
router.get('/:id', auth.isAuthenticated, (req, res) => {
    Post.findById(req.params.id).populate('author').exec((err, post) => {
        if (err) throw err;

        res.render('users/post', {post, user: req.user});
    });
});

// Edit currently logged in user.
router.put('/:id', auth.isAuthenticated, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body);

    res.redirect('/posts');
});


// Delete currently logged in user.
router.delete('/:id', auth.isAuthenticated, (req, res) => {
    Post.findByIdAndDelete(req.params.id, (err) => {
        if (err) console.error(err);

        res.redirect('/posts');
    });
});

// Get a specific user.
router.get('/:id', auth.isAdmin, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) throw err;

        res.json(post);
    });
});

module.exports = router;