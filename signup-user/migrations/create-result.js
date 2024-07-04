'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Results', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            stdid: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Standards',
                    key: 'id'
                }
            },
            subid: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Subjects',
                    key: 'id'
                }
            },
            chapterid: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Chapters',
                    key: 'id'
                }
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Results');
    }
};
