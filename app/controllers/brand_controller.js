const config = require('../config');
const Brand = require('../models').Brand;
const User = require('../models').User;

exports.getByOwner = (id) => {
    return new Promise(function(resolve, reject) {
        Brand.findOne({
            where: {
                owned_by: id
            }
        })
        .then((brand) => {
            if(brand){
                resolve(brand);
            }else{
                resolve(null);
            }
        })
        .catch(err => {
            resolve(null);
        });
    });

}

exports.getAllBrands = (req, res) => {
    Brand.findAll({})
    .then((allBrands) => {
        if(allBrands){
            res.json({ allBrands });
        }else{
            return res.status(404).send({ message: 'Brands do not exist.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getBrandById = (req, res) => {
    Brand.findOne({
        where: {
            id: req.params.id
        }
    })
    .then((brand) => {
        if(brand){
            res.json({ brand });
        }else{
            return res.status(404).send({ message: 'Brand do not exist.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getBrandFollowers = (req, res) => {
    Brand.findOne({
        where: {
             id: req.params.id
        },
        include: [
            {
                model: User,
                as: 'brandFollowers',
                attributes: ['id', 'firstname', 'lastname', 'email']
            }
        ]
    }).then((brand) => {
        if(brand.brandFollowers && brand.brandFollowers.length){
            res.json({ followers: brand.brandFollowers });
        }else{
            return res.status(400).send({ message: 'No Followers.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.giftLoyalPoints = async (req, res) => {
    try {
        const brand = await Brand.findOne({id: req.params.id});
        const { gifts } = req.body;
        const total_lp = gifts.map(item => parseInt(item.lp, 10)).reduce((a, b) => a + b);
        if(brand.max_lp < total_lp){
            return res.status(400).send({ message: 'Not enough points by Brand.' });
        }else{
            const user_ids = gifts.map((each) => {
                return each.user_id;
            });
            Brand.giftUsers(brand, user_ids, gifts, total_lp)
            .then((giftedUsers) => {
                if(giftedUsers){
                    res.json({ gifts: giftedUsers });
                }else{
                    return res.status(400).send({ message: 'Something wrong, please try again' });
                }
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
