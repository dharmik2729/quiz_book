'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stdid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
           model: 'Standards',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      subjectName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subjects');
  }
};
