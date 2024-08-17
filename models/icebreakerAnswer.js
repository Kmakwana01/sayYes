const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Activity extends Model {}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'icebreakerAnswers',
  }
);

module.exports = Activity;
