const Sequelize = require('sequelize');

class LoyalPoints extends Sequelize.Model{
    static get fields() {
        return {
            user_id: {type: Sequelize.STRING, allowNull: false, primaryKey: true, field: 'user_id'},
            brand_id: {type: Sequelize.STRING, allowNull: false, primaryKey: true, field: 'brand_id'},
            gifted_lp: {type: Sequelize.INTEGER, allowNull: false, field: 'gifted_lp', defaultValue: 0},
            claimed_lp: {type: Sequelize.INTEGER, allowNull: false, field: 'claimed_lp', defaultValue: 0},
        }
    }

    static getOptions(sequelize) {
        return {
            timestamps: false,
            tableName: 'loyal_points',
            sequelize
        }
    }

    static init(sequelize, Sequelize) {
        return super.init(this.fields, this.getOptions(sequelize))
    }

}

module.exports = LoyalPoints;
