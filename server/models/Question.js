// models/Question.js

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    questionID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.ENUM('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'FILL_IN_THE_BLANKS'),
      allowNull: false,
    },
    correctAns: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for MCQ questions
    },
    source: {
      type: DataTypes.ENUM('AI', 'manual'),
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'Questions',
  });

  Question.associate = function(models) {
    Question.hasMany(models.Option, { 
      as: 'options', 
      foreignKey: 'questionID' 
    });
    Question.belongsToMany(models.Quiz, {
      through: 'Quiz_Questions',
      foreignKey: 'questionID',
      as: 'quizzes'
    });
  };

  return Question;
};
