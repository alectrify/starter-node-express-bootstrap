const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {collection: 'users'});

/* ---------- HOOKS ---------- */
/* ----- Pre ----- */
userSchema.pre('save', async function (next) {
    // Condition will hold true when new user is created or password modification
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

/* ---------- FUNCTIONS ---------- */
/* ----- Instance Methods ----- */
userSchema.methods.verifyPassword = function(inputPassword, callback) {
    return bcrypt.compare(inputPassword, this.password, callback);
}

/* ----- Static ----- */
userSchema.statics.findByCredentials = function (email, password) {
    return this.findOne({email}, (err, user) => {
        if (err) throw err;

        if (!user) {
            return null;
            // throw new Error('Invalid email');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return null;
                // throw new Error('Invalid password');
            } else {
                return user;
            }
        });
    });
}

module.exports = mongoose.model('User', userSchema);