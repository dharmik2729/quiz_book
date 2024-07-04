'use strict';
const { Model, DataTypes } = require('sequelize');
const Chapter = require('./chapter')

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Standard, { foreignKey: 'stdid', as: 'standard' });
      Question.belongsTo(models.Subject, { foreignKey: 'subid', as: 'subjects' });  
      Question.belongsTo(models.Chapter, { foreignKey: 'chapterid', as: 'chapters' });
    }
  }

  Question.init({
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
    chapterid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Chapters',
        key: 'id'
      }
    },
    question_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Option: {
      type: DataTypes.JSON,
      allowNull: false
    },
    rightAns: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Question',
  });

  return Question;
};
