'use strict';
const { Model, DataTypes} = require('sequelize');
const Chapter = require('./chapter')
const Subject = require('./subjects')

module.exports = (sequelize, DataTypes) => {
  class Standard extends Model {
    static associate(models) {
      Standard.hasMany(models.Subject, { foreignKey: 'stdid', as: 'subjects' });
      Standard.hasMany(models.Chapter, { foreignKey: 'stdid', as: 'chapters' });
    }
  }
  Standard.init({
    std: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Standard',
  });
  return Standard;
};
