'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Professions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });

    // Insert predefined professions
    await queryInterface.bulkInsert('Professions', [
      { id: 1, name: 'Student' },
      { id: 2, name: 'Teacher' },
      { id: 3, name: 'Admin' },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Professions');
  }
};
