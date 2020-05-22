const Sequelize = require('sequelize');

class Following extends Sequelize.Model{
    static get fields() {
        return {
            user_id: {type: Sequelize.STRING, allowNull: false, field: 'user_id', primaryKey: true},
            brand_id: {type: Sequelize.STRING, allowNull: false, field: 'brand_id', primaryKey: true}
        }
    }

    static getOptions(sequelize) {
        return {
            timestamps: false,
            tableName: 'following',
            sequelize
        }
    }

    static associate(models) {
        this.belongsTo(models.Brand, { foreignKey: 'brand_id', targetKey: 'id', as: 'brand' });
        this.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', as: 'user' });
    }

    static init(sequelize, Sequelize) {
        return super.init(this.fields, this.getOptions(sequelize))
    }

}

module.exports = Following;
