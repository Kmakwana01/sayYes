const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./user');

class Userreport extends Model {}

Userreport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // 'Actors' would also work
        key: 'userId',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    report_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // 'Actors' would also work
        key: 'userId',
      },
    },
    delete_notification_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'userreports',
  }
);

module.exports = Userreport;
