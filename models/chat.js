const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class chat extends Model {}

chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file : {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail : {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    userId_dele: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRead:{
      type: DataTypes.BOOLEAN,
      allowNull : false
    },
    type : {
      type: DataTypes.ENUM('image','video','audio','text'),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'chat',
  }
);

module.exports = chat;
