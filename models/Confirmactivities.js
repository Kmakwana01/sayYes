const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class ConfirmActivities extends Model {}

ConfirmActivities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    SendTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: '',
    },
    SendBY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: '',
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
      default: '',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'confirmActivities',
  }
);

module.exports = ConfirmActivities;
