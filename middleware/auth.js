const DEV_MODE = process.env.LOGGED_IN === 'true'; // To automatically log in after server refresh

authObj = {};

authObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401);
        res.render('landing', {attempt: req.query.login});
    }
}

authObj.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(404);
        res.render('404');
    }
}

authObj.isAdmin = (req, res, next) => {
    if (DEV_MODE) {
        next();
    } else {
        res.status(404);
        res.render('404');
    }
}

module.exports = authObj;