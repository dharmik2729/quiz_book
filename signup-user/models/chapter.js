'use strict';
const { Model, DataTypes } = require('sequelize');
const Standard = require('./standard');
const Subject = require('./subjects');


module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
        Chapter.belongsTo(models.Standard, { foreignKey: 'stdid', as: 'standard' });
        Chapter.belongsTo(models.Subject, { foreignKey: 'subid', as: 'subjects' });
        Chapter.hasMany(models.Question, { foreignKey: 'chapterid', as: 'questions' });

    }
  }

  Chapter.init({
    chapterid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stdid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Standards', 
        key: 'id'
      }
    },
    subid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subjects', 
        key: 'id'
      }
    },
    chapterno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    teacher: {
      type: DataTypes.STRING,
      allowNull: false
    },
    que: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minute: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Chapter'
  });

  return Chapter;
};
