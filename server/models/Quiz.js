// models/Quiz.js
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    quizID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    quizName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visibility: {
      type: DataTypes.ENUM('private', 'public'),
      allowNull: true,
      defaultValue: 'private'
    },
    topicID: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    questionMode: {
      type: DataTypes.ENUM('manual', 'ai'),
      allowNull: false,
      defaultValue: 'manual'
    },
    status: {
      type: DataTypes.ENUM('draft', 'ready'),
      allowNull: false,
      defaultValue: 'draft'
    },
    currentStep: {
      type: DataTypes.ENUM('initial', 'mode_selected', 'questions_added'),
      allowNull: false,
      defaultValue: 'initial'
    }
  }, {
    tableName: 'Quizzes',
    timestamps: true
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Topic, { as: 'topic', foreignKey: 'topicID' });
  };

  return Quiz;
};