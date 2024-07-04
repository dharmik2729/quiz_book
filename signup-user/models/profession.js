'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profession extends Model {
    static associate(models) {
      Profession.hasMany(models.User, { foreignKey: 'professionId', as: 'users' });
    }
  }
  Profession.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Profession',
  });
  return Profession;
};
