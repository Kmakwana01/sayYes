const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Flage extends Model {}

Flage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: '',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: '',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      default: '',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'flages',
  }
);

module.exports = Flage;
