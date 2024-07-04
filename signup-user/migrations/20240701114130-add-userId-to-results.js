'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Add the userId column
    await queryInterface.addColumn('Results', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Remove the userId column
    await queryInterface.removeColumn('Results', 'userId');

    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
