const bcrypt = require('bcrypt');

const saltRounds = 10;

const encryptPassword = (req, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds)
            .then(salt => {
                bcrypt.hash(password, salt)
                    .then(hash => {
                        req.logger.info('Encrypted the password');
                        resolve(hash);
                    })
                    .catch(error => {
                        req.logger.error('Error: encryptPassword : Generate Hash', error);
                        reject(error);
                    });
            })
            .catch(error => {
                req.logger.error('Error: encryptPassword : Generate Salt', error);
                reject(error);
            });
    });
}

const decryptPassword = (req, password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports = {
    encryptPassword,
    decryptPassword
};