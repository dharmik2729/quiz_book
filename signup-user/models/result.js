const UserAnswer = require('./UserAnswer')

module.exports = (sequelize, DataTypes) => {
    const Result = sequelize.define('Result', {
        stdid: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Standards',
                key: 'id'
            }
        },
        subid: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Subjects',
                key: 'id'
            }
        },
        chapterid: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Chapters',
                key: 'id'
            }
        },
        userId: { 
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', 
            key: 'id' 
    }
  }
    });

    Result.associate = models => {
        Result.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Result.hasMany(models.UserAnswer, { foreignKey: 'resultId', as: 'userAnswers', onDelete: 'CASCADE'  });

    };

    return Result;
};
