const Sequelize = require('sequelize');
const LoyalPoints = require('./loyal_points');

class Brand extends Sequelize.Model{
    static get fields() {
        return {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false, field: 'name'},
            max_lp: {type: Sequelize.INTEGER, allowNull: false, field: 'max_lp'},
            owned_by: {type: Sequelize.INTEGER, allowNull: false, field: 'owned_by'}
        }
    }

    static getOptions(sequelize) {
        return {
            timestamps: false,
            tableName: 'brand',
            sequelize
        }
    }

    static associate(models){
        this.belongsToMany(models.User, { as: 'brandFollowers', through: models.Following, foreignKey: 'brand_id'});
    }

    static getBrandFollowers(brandId){
        return new Promise(function(resolve, reject) {

        });
    }

    static giftUsers(brand, user_ids, gifts, total_lp){
        return this.sequelize.transaction( (transaction) => {
            return new Promise((resolve, reject) => {
                brand.update({
                    max_lp: brand.max_lp - parseInt(total_lp, 10)
                }).then((updatedBrand) => {
                    resolve(updatedBrand);
                })
            })
            .then(async (updatedBrand) => {
                const giftedRows = await LoyalPoints.findAll({
                    where: {
                        brand_id: brand.id,
                        user_id: user_ids
                    }
                });
                let lpPayload = [];
                gifts.map((eachUserGift) => {
                    const index = giftedRows.findIndex((each) => {return each.user_id === eachUserGift.user_id});
                    lpPayload.push({
                        brand_id: brand.id,
                        user_id: eachUserGift.user_id,
                        gifted_lp: index > -1 ? (giftedRows[index].gifted_lp + parseInt(eachUserGift.lp, 10)): parseInt(eachUserGift.lp, 10)
                    });
                });
                return LoyalPoints.bulkCreate(
                            lpPayload,
                            { updateOnDuplicate: ['gifted_lp'] },
                        {transaction}
                    )
            });
        })
        .then(giftedPoints => {
            return Promise.resolve(giftedPoints);
        });
    }

    static init(sequelize, Sequelize) {
        return super.init(this.fields, this.getOptions(sequelize))
    }

}

module.exports = Brand;
