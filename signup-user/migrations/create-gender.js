'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Genders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });

    // Insert predefined genders
    await queryInterface.bulkInsert('Genders', [
      { id: 1, name: 'MALE' },
      { id: 2, name: 'FEMALE' },
      { id: 3, name: 'OTHER'},
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Genders');
  }
};
