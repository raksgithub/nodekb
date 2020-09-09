const pino = require('pino');
const { v4 } = require('uuid');
const expressPino = require('express-pino-logger');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const expressLogger = expressPino({ 
    logger,
    genReqId: req => v4()
});

const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    next();
}

module.exports = { logger, expressLogger, loggerMiddleware };