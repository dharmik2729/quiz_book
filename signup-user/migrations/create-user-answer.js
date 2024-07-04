'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserAnswers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            resultId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Results',
                    key: 'id'
                }
            },
            queid: {
                type: Sequelize.INTEGER
            },
            user_answer: {
                type: Sequelize.INTEGER
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UserAnswers');
    }
};
