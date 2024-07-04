'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chapterid: {
        allowNull: true,
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
      chapterno: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      teacher: {
        type: Sequelize.STRING,
        allowNull: false
      },
      que: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minute: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};