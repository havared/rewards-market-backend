const User = require('../models').User;
const Brand = require('../models').Brand;
const Following = require('../models').Following;
const LoyalPoints = require('../models').LoyalPoints;
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BrandController = require('./brand_controller');

exports.signup = (req, res) => {
    if(req.body.is_brand && req.body.is_brand){
        User.createBrandWithUser(req.body)
        .then((brand) => {
            res.send({ message: 'Brand was registered successfully!' });
        })
        .catch(err => {
            console.log('err', err);
            res.status(500).send({ message: err.message });
        });
    }else{
        User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            res.send({ message: 'User was registered successfully!' });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    }

}

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email.toLowerCase()
        }
    })
    .then(async user => {
        let brand = null;
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        let isPasswordMatching = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!isPasswordMatching) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!'
            });
        }
        if(user.user_type === 1){
            brand = await BrandController.getByOwner(user.id)
        }
        let token = jwt.sign({ user_id: user.id, user_type: user.user_type }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            accessToken: token,
            user_type: user.user_type,
            brand: brand
        });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.followBrands = (req, res) => {
    const {brands} = req.body;
    Brand.findAll({
        where: {
            id: brands
        }
    })
    .then((allBrands) => {
        if(allBrands && allBrands.length === brands.length){
            const followingBrandsPayload = brands.map((eachB) => {
                return {
                    user_id: req.userId,
                    brand_id: eachB
                }
            });
            Following.bulkCreate(
                followingBrandsPayload,
                { fields: ['user_id', 'brand_id'], updateOnDuplicate: ['user_id', 'brand_id'] }
            ).then((data) => {
                res.json({ data });
            });
        }else{
            return res.status(404).send({ message: 'Some brands do not exist.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllFollowingBrands = (req, res) => {
    User.getAllFollowingBrands(req.userId)
    .then((brands) => {
        if(brands){
            res.json({ brands });
        }else{
            return res.status(404).send({ message: 'User is not following any brands.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getGift = (req, res) => {
    LoyalPoints.findOne({
        where: {
            user_id: req.userId,
            brand_id: req.params.brandId,
        }
    })
    .then((lp) => {
        if(!lp){
            return res.status(404).send({ message: 'Gift unavailable' });
        }else{
            return res.json({ lp });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.claimLP = (req, res) => {
    LoyalPoints.findOne({
        where: {
            user_id: req.userId,
            brand_id: req.params.brandId,
        }
    })
    .then((lp) => {
        if(!lp){
            return res.status(404).send({ message: 'Gift unavailable' });
        }else{
            if(lp.gifted_lp < req.body.claim_lp){
                return res.status(404).send({ message: 'Not enough points' });
            }else{
                try{
                    lp.update({
                        claimed_lp: lp.claimed_lp + parseInt(req.body.claim_lp, 10),
                        gifted_lp: lp.gifted_lp - parseInt(req.body.claim_lp, 10)
                    }).then((updatedLp) => {
                        res.send({ lp: updatedLp,  message: 'Successfully claimed!' });
                    })
                }catch (e){
                    return res.status(404).send({ message: 'Something wrong!' });
                }
            }
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}
