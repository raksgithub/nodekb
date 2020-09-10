const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./authentication/passport.config');
const { encryptPassword } = require('./encryption');
require('./db');
const Article = require('./models/article');
const User = require('./models/user');
const { logger, expressLogger, loggerMiddleware } = require('./logger');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);
app.use(expressLogger);

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SECRET_KEY || 'shhhh' }));
app.use(passportConfig.configureLocalStrategy);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
    const articles = await Article.find({});
    res.render('index', {
        title: 'Articles',
        articles,
        user: req.user,
        message: req.message
    }); 
});

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true 
    })
);

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    try {
        encryptPassword(req, password)
            .then(async encryptedPassword => {
                const newUser = new User({
                    username,
                    password: encryptedPassword
                });
                await newUser.save();
                res.redirect('/login');
            });
    } 
    catch(error) {
        res.status(500).send('Signup Failed');
    }
});

app.post('/articles/add', async (req, res) => {
    const { title, author, body } = req.body;
    const article = new Article({
        title,
        author,
        body
    });
    const newArticle = await article.save();
    res.redirect('/');
});

app.listen(port, () => {
    logger.info(`Server is listening at port http://localhost:${port}`);
});