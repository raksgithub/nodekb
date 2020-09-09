const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('./db');
const Article = require('./models/article');
const { logger, expressLogger, loggerMiddleware } = require('./logger');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);
app.use(expressLogger);

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
    const articles = await Article.find({});
    res.render('index', {
        title: 'Articles',
        articles
    }); 
});

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    });
});

app.post('/articles/add', async (req, res) => {
    const { title, author, body } = req.body;
    const article = new Article({
        title,
        author,
        body
    });
    const newArticle = await article.save();
    logger.info('New Aritcle:', newArticle);
    res.redirect('/');
});

app.listen(port, () => {
    logger.info(`Server is listening at port http://localhost:${port}`);
});