const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { decryptPassword } = require('../encryption');

const serialiAndDeserializeUser = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
}

const configureLocalStrategy = (req, res, next) => {
    passport.use('local', new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if(!user) {
                return done(null, false, { message: 'Invalid User' });
            }
            const isPasswordValid = await decryptPassword(req, password, user.password);
            if(!isPasswordValid) {
                return done(null, false, { message: 'Invalid Password' });
            }
            return done(null, user);
        }
        catch(error) {
            return done(error);
        }
    }));
    serialiAndDeserializeUser();
    next();
}

module.exports = {
    configureLocalStrategy,
}