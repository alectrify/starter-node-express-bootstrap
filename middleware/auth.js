const DEV_VIEW_MODE = process.env.DEV_VIEW_MODE; // To automatically log in after server refresh

let authObj = {};

authObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.render('landing', {flash: req.flash('error')});
    }
};

authObj.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(404);
        res.render('404');
    }
};

authObj.isAdmin = (req, res, next) => {
    if (DEV_VIEW_MODE === 'admin' || (req.isAuthenticated() && req.user.plan === 'Admin')) {
        next();
    }
    else {
        res.status(404);
        res.render('404');
    }
};

module.exports = authObj;