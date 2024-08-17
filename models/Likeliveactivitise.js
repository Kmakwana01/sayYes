const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Likeliveactivitise extends Model {}

Likeliveactivitise.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: 'users',
    },
    live_activitise_id: {
      type: DataTypes.INTEGER,
      references: 'liveactivities',
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'likeliveactivitises',
  }
);

module.exports = Likeliveactivitise;
