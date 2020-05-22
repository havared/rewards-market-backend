const express = require('express');
const router = express.Router();
const { checkDuplicateEmail } = require('../middleware/signup');
const { verifyToken, isCustomer } = require('../middleware/auth');
const UserController = require('../controllers/user_controller');

module.exports = function() {
    router.use(function(req, res, next) {
        res.header(
          'Access-Control-Allow-Headers',
          'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    router.post(
        '/user/signup',
        [
            checkDuplicateEmail
        ],
        UserController.signup
    );

    router.post('/user/signin', UserController.signin);

    router.post(
        '/user/:id/follow-brands',
        [
            verifyToken,
            isCustomer
        ],
        UserController.followBrands
    );

    router.get(
        '/user/:id/brands',
        [
            verifyToken,
            isCustomer
        ],
        UserController.getAllFollowingBrands
    );

    router.get(
        '/user/:id/brand/:brandId/gift',
        [
            verifyToken,
            isCustomer
        ],
        UserController.getGift
    );

    router.put(
        '/user/:id/brand/:brandId/claim',
        [
            verifyToken,
            isCustomer
        ],
        UserController.claimLP
    );

    return router;
}
