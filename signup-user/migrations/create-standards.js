'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Standards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      std: {
        type: Sequelize.STRING,
        allowNull: false
      }  
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Standards');
  }
};
