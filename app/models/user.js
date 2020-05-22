const Sequelize = require('sequelize');
const Brand = require('./brand');
const bcrypt = require('bcryptjs');

class User extends Sequelize.Model{
    static get fields() {
        return {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            firstname: {type: Sequelize.STRING, allowNull: false, field: 'firstname'},
            lastname: {type: Sequelize.STRING, allowNull: false, field: 'lastname'},
            password: {type: Sequelize.STRING, allowNull: false, field: 'password'},
            email: {type: Sequelize.STRING, allowNull: false, field: 'email'},
            user_type: {type: Sequelize.STRING, allowNull: false, defaultValue: 0, field: 'user_type'}
        }
    }

    static getOptions(sequelize) {
        return {
            timestamps: false,
            tableName: 'users',
            sequelize
        }
    }

    static associate(models){
        this.belongsToMany(models.Brand, { as: 'followingBrands', through: models.Following, foreignKey: 'user_id'});
    }

    static getAllFollowingBrands(userId){
        return new Promise(function(resolve, reject) {
            User.findOne({
                where: {
                     id: userId
                },
                include: [
                    {
                        model: Brand,
                        as: 'followingBrands'
                    }
                ]
            }).then((user) => {
                if(user.followingBrands && user.followingBrands.length){
                    resolve(user.followingBrands);
                }else{
                    resolve([])
                }
            });
        });
    }

    static createBrandWithUser(payload) {
        return this.sequelize.transaction( (transaction) => {
            return new Promise((resolve, reject) => {
                User.create({
                    firstname: payload.firstname,
                    lastname: payload.lastname,
                    email: payload.email.toLowerCase(),
                    password: bcrypt.hashSync(payload.password, 8),
                    user_type: 1
                }).then((createdUser) => {
                    resolve(createdUser);
                })
            })
            .then(newUser => {
                const brandPayload = {
                    ...payload.brand,
                    owned_by: newUser.id
                };
                return Brand.create(brandPayload, {transaction});
            });
        })
        .then(newBrand => {
            return Promise.resolve(newBrand);
        });
    }

    static init(sequelize, Sequelize) {
        return super.init(this.fields, this.getOptions(sequelize))
    }

}


module.exports = User;
