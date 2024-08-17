const { DataTypes, Model, DATEONLY } = require('sequelize');
const sequelize = require('../database/database');

class UserRequest extends Model {}

UserRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    sentBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
    sentTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: '',
    },
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
    activity_address: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    activity_image: {
      type: DataTypes.TEXT,
      default: '',
    },
    sentToimage: {
      type: DataTypes.TEXT,
      default: '',
    },
    sentToNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sentBYNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    confirm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clientResponse: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'userRequests',
  }
);

module.exports = UserRequest;
