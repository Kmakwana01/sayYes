const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      default: '',
    },
    type: {
      type: DataTypes.ENUM('like','request', 'requestAccepted', 'requestDeclined', 'message', 'mention', 'save', 'confirm' , "reelLike"),
      allowNull: false,
    },
    isRead : {
      type : Boolean,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'notification',
  }
);

module.exports = Notification;
