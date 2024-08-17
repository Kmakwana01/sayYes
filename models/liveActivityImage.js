const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');

class LiveActivityImage extends Model {}

LiveActivityImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'liveActivityImages',
  }
);

module.exports = LiveActivityImage;
