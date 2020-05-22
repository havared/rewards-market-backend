const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models').User;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.user_id;
        next();
    });
};

isBrandOwner = (req, res, next) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(user => {
        if (!user) {
            res.status(400).send({
                message: 'User does not exist.'
            });
            return;
        }
        if(user.user_type !== 1){
            res.status(400).send({
                message: 'User does not have access.'
            });
            return;
        }
        next();
    });
};

isCustomer = (req, res, next) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(user => {
        if (!user) {
            res.status(400).send({
                message: 'User does not exist.'
            });
            return;
        }
        if (user.user_type !== 0) {
            res.status(400).send({
                message: 'User does not have access.'
            });
            return;
        }
        next();
    });
};

module.exports = { verifyToken, isCustomer, isBrandOwner };
