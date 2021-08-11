# 💡 starter-node-express-bootstrap
Use this template to initialize your Express, MongoDB, and Node.js web application or website with a basic structure and starter code stylized with Bootstrap.

*Work In Progress*

## 🚀 Getting Started
### Installation
* Download [Node.js](https://nodejs.org/en/download/).   
* Download the [nodemon](https://www.npmjs.com/package/nodemon) package globally.  
* Download [MongoDB Community Server](https://www.mongodb.com/try/download/community).

### Initialization & Setup
1. Create a `.env` file to hold environment variables. ([dotenv module](https://www.npmjs.com/package/dotenv))
   1. DEV_VIEW_MODE=\[visitor, user, or admin\] - log in upon server refresh for user development
   2. DEV_USER_ID=\[MongoDB _id\] - MongoDB _id of a record to automatically log in with 
   3. SENDGRID_API_KEY=\[SendGrid API Key\] - SendGrid API key for email functionality
2. Edit the name of your database by editing the `DB_NAME` constant in `index.js`.
3. Edit metadata information for SEO and data accuracy in:
   * `package.json`
   * `README.md` 
   * `public/manifest.json`
   * `public/robots.txt`
   * `public/sitemap.xml`
   * `views/landing.ejs`
4. Run `npm install` to install packages.

## ⚙️ Usage/Workflow Details
### Development Process
1. Ensure that your MongoDB server is running locally for database functionality. 
2. Run `nodemon` in your terminal while testing to automatically refresh your back-end after editing.  
3. Develop front-end by creating HTML pages w/ EJS in the `views` directory and editing styles in `public/styles/styles.css`.
4. Work on back-end by editing `models`, `routes`, and `index.js`.
5. (optional) Customize Bootstrap CSS in `src/bootstrap.css` and compile it with `npm run sass` to export your bundled CSS to `public/styles/bootstrap.css`.

### Scripts
Run `npm install` in the root directory to install packages.  
Run `npm run fix` to run ESLint fixes on your backend Javascript.  
Run `npm run lint` to run ESLint analysis on your backend Javascript.  
Run `npm run sass` to compile Bootstrap CSS from the `src` folder.  
Run `npm run build` to compile CSS and Javascript from the `src` folder.  
Run `npm run build:css` to compile Bootstrap CSS and postprocess vendor prefixes in `public/styles/styles.css`.  
Run `npm run build:js` to compile (w/ webpack) JavaScript libraries from the `src` folder.

### Directory Details
1. The auth directory contains Passport.js configurations. (Work In Progress)
2. The `public` directory contains front-end and site metadata.
3. The `models` directory contains MongoDB models.
4. The `routes` directory contains routes for endpoints and API calls.
5. The `src` directory contains pre-compiled Bootstrap CSS and JS that is to be bundled into front-end (`public`) using the
   scripts mentioned above in the Installation Details.
6. The `views` directory contains the EJS pages to be rendered by Express.

### Deployment
1. Create a MongoDB Atlas database and collection and copy your connection URI. 
2. Create a Heroku app and enable automatic deployment to your repository.
3. Set environment variables for your Heroku app.
   1. MONGO_URI - MongoDB Atlas connection URI
   2. SESSION_SECRET - Express session secret

## ✔️ Current Release Details
### Main Package Versions
* **Bootstrap** v5.0.0  
* **Express** v4.x  
* **Mongoose** v5.12.2

### Packages Included
* @fortawesome/fontawesome-free - Font Awesome Icons
* @sendgrid/mail - email functionality
* autoprefixer - adding vendor prefixes to css
* bcryptjs - password-hashing
* bootstrap & @popperjs/core - styling
* body-parser - essential for express
* chalk - colorful terminal output
* compression, cors, helmet, serve-favicon - essential middleware
* dompurify & jsdom - sanitization
* dotenv - environment variables
* ejs - template engine
* eslint - linting code
* express - essential
* express-flash - error message flashing
* express-session - sessions
* fs-extra - updating Font Awesome icons
* jquery - dynamic page elements
* lodash - coding utility
* method-override - enabling methods for the client
* mongoose - database functionality
* multer - backend file upload functionality
* nodemon - development quality of life
* passport - authentication
* postcss & postcss-cli - CSS postprocessing (ex: autoprefixer)
* sass - customizing and compiling Bootstrap
* sharp - image processing
* validator - formatting validation
* webpack & webpack-cli - JS postprocessing

## 📅 Future Release Plans
* Different ports for other styling frameworks like Tailwind
* E-mail encryption and forgot password functionality
* More detailed starter code
* Additional example pages

## 🗒️ Additional Resources
### Best Practices
* [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
* [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
  
### Documentation
* [Bootstrap Docs](https://getbootstrap.com/)
* [Express 4.x API Docs](https://expressjs.com/en/4x/api.html)
* [Lodash Docs](https://lodash.com/docs/4.17.15)  
* [Mongoose Docs](https://mongoosejs.com/docs/api.html)  
  
### Tools and References
* [Can I Use...](https://caniuse.com) - Browser support tables for HTML5, CSS3, etc
* [Coolors Color Picker](https://coolors.co/a8ab66)
* [Font Awesome Icons Gallery](https://fontawesome.com/icons?d=gallery&m=free)
* [Google Fonts](https://fonts.google.com/)
* [Hero Patterns](https://www.heropatterns.com/) - Customizable SVG background patterns
* [Lorem Ipsum Generator](https://www.lipsum.com/)
* [Placeholder.com](https://placeholder.com) - Free image placeholder service
* [Regex Expression Tester](https://regex101.com/)
* [Scale](https://2.flexiple.com/scale/all-illustrations) - Free and customizable vector illustrations
* [SRI Hash Generator](https://www.srihash.org)   