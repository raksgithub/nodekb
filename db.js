const mongoose = require('mongoose');

const mongo_uri = `${process.env.MONGO_URL}/nodekb` || 'mongodb://localhost:27017/nodekb';
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to DB');
});

db.on('error', () => {
    console.log('error occurred');
});