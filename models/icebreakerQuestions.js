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
      allowNull: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'icebreakerQuestions',
  }
);

module.exports = Activity;
