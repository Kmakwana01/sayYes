const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Blockuser extends Model {}

Blockuser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_blocked_by: {
      type: DataTypes.INTEGER,
      references: 'users',
    },
    blocked_user_id: {
      type: DataTypes.INTEGER,
      references: 'users',
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'blockusers',
  }
);

module.exports = Blockuser;
