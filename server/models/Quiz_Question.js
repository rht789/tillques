// models/Quiz_Question.js

module.exports = (sequelize, DataTypes) => {
  const Quiz_Question = sequelize.define('Quiz_Question', {
    quizID: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Quizzes',
        key: 'quizID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    questionID: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Questions',
        key: 'questionID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    timestamps: false,
    tableName: 'Quiz_Questions',
  });

  return Quiz_Question;
};
