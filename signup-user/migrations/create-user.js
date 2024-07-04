'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      genderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genders',
          key: 'id'
        }
      },
      DOB: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      professionId: {
        type: Sequelize.INTEGER
      },
      userProfile: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};










