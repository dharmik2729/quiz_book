'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stdid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Standards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Subjects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      chapterid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Chapters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      question_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Option: {
        type: Sequelize.JSON,
        allowNull: false
      },
      rightAns: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Questions');
  }
};
