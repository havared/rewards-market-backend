'use strict';
const config = require('../config/db-config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: 0,
        pool: {
          max: config.pool.max,
          min: config.pool.min,
          acquire: config.pool.acquire,
          idle: config.pool.idle
        }
    }
);

const UserModel = require('./user');
const BrandModel = require('./brand');
const FollowingModel = require('./following');
const LoyalPointsModel = require('./loyal_points');

const models = {
  User: UserModel.init(sequelize, Sequelize),
  Brand: BrandModel.init(sequelize, Sequelize),
  Following: FollowingModel.init(sequelize, Sequelize),
  LoyalPoints: LoyalPointsModel.init(sequelize, Sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
