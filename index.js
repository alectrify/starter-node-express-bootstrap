/* ---------- MODULES ---------- */
const bodyParser = require('body-parser');
const chalk = require('chalk');
const compression = require('compression');
const cors = require('cors');
const DOTENV_RESULT = require('dotenv').config();
const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs-extra');
const helmet = require('helmet');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');

/* ---------- CUSTOM MODULES ---------- */


/* ---------- CONSTANTS ---------- */
const app = express();
const port = process.env.PORT || 3000;

/* ---------- FUNCTIONS ---------- */
function updateFontAwesome() {
    fs.copy('./node_modules/@fortawesome/fontawesome-free/css/all.min.css', 'dist/styles/fontawesome.css', (err) => {
        if (err) throw err;
    });

    fs.copy('./node_modules/@fortawesome/fontawesome-free/webfonts', 'dist/webfonts', (err) => {
        if (err) throw err;
    });
}

/* ---------- INITIALIZATION ---------- */
// updateFontAwesome();

/* ----- Dotenv ----- */
if (DOTENV_RESULT.error) {
    console.error(chalk.red(`${DOTENV_RESULT.error}`));
}

/* ----- Express ----- */
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/dist')); // url path begins at /dist

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(compression()); // compress all responses
app.use(favicon(path.join(__dirname, 'dist', 'images', 'favicon.ico'))); // go to http://localhost:3000/images/favicon.ico to refresh icon
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(methodOverride('_method')); // override with POST request w/ ?_method=DELETE or ?_method=PUT
app.use(session({
    name: 'qid',
    secret: process.env.SESSION_SECRET || 'dQw4w9WgXcQ',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 2 * 365 // 2 years
    }
}));

/* ---------- ROUTES ---------- */
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// Redirect invalid pages
app.use((req, res) => {
    res.format({
        html: () => {
            console.error(chalk.red.bold(`Error 404: Requested page ${req.originalUrl}`));
            res.render('404');
        },
        json: () => {
            res.json({error: 'Not found'})
        },
        default: () => {
            res.type('txt').send('Not found')
        }
    });
});

/* ---------- LAUNCH ---------- */
app.listen(port, () => {
    console.log(chalk.blue(`🚀 Server running at http://localhost:${port}/`));
    console.log(chalk.green('📝 Setup and details for this template: https://github.com/AdoryVo/node-website-template\n'));
});