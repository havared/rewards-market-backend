const express = require('express');
const router = express.Router();
const { verifyToken, isBrandOwner } = require('../middleware/auth');
const BrandController = require('../controllers/brand_controller');

module.exports = function() {
    router.use(function(req, res, next) {
        res.header(
          'Access-Control-Allow-Headers',
          'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    router.get(
        '/brands',
        [ verifyToken ],
        BrandController.getAllBrands
    );

    router.get(
        '/brand/:id',
        [ verifyToken ],
        BrandController.getBrandById
    );

    router.get(
        '/brand/:id/followers',
        [ verifyToken, isBrandOwner ],
        BrandController.getBrandFollowers
    );

    router.post(
        '/brand/:id/gift',
        [ verifyToken, isBrandOwner ],
        BrandController.giftLoyalPoints
    );

    return router;
}
