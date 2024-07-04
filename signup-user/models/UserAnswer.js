const Result = require('./result')


module.exports = (sequelize, DataTypes) => {
    const UserAnswer = sequelize.define('UserAnswer', {
        resultId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Results',
                key: 'id'
            }
        },
        queid: DataTypes.INTEGER,
        user_answer: DataTypes.INTEGER
    });
    
    UserAnswer.associate = models => {
        // Result.hasMany(models.UserAnswer, { as: 'userAnswers', foreignKey: 'resultId' });
        UserAnswer.belongsTo(models.Result, { foreignKey: 'resultId', as: 'result' });
    };

    return UserAnswer;
};
