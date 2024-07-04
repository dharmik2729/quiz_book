'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      User.hasMany(models.Result, { foreignKey: 'userId', as: 'results', onDelete: 'CASCADE'  });
      User.belongsTo(models.Gender, { foreignKey: 'genderID', as: 'gender' });
      User.belongsTo(models.Profession, { foreignKey: 'professionId', as: 'profession' });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    genderID: DataTypes.INTEGER,
    DOB: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    professionId: DataTypes.INTEGER,
    userProfile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};