'use strict';
const { Model, DataTypes} = require('sequelize');
const Standard = require('./standard');
const Chapter = require('./chapter');

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
        Subject.belongsTo(models.Standard, { foreignKey: 'stdid', as: 'standard' })
        Subject.hasMany(models.Chapter, { foreignKey: 'subid', as: 'chapters' });

    }
  }

Subject.init({
  stdid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Standards', 
        key: 'id' 
      }
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Subject',
  });
  return Subject;
};
