const User = require('../models').User;

checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user) {
            res.status(400).send({
                message: 'Email is already in use!'
            });
            return;
        }
        next();
    });
};

module.exports = {checkDuplicateEmail}
