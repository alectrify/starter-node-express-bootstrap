// To be added to .gitignore
const ids = {
    github: {
        clientID: 'get_your_own',
        clientSecret: 'get_your_own',
        callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    linkedin: {
        clientID: 'get_your_own',
        clientSecret: 'get_your_own',
        callbackURL: 'http://127.0.0.1:3000/auth/linkedin/callback'
    },
    twitter: {
        consumerKey: 'get_your_own',
        consumerSecret: 'get_your_own',
        callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
    }
};

module.exports = ids;