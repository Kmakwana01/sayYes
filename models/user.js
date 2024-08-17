const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');
const moment = require('moment');
const Gender = require('./gender.js');

class User extends Model {}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthday: {
      type: DataTypes.STRING,
      defaultValue: '',
      // defaultValue:moment.utc().format('MM/DD/YYYY'),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    genderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    intrestedIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    google_social_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_social_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apple_social_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    availableForPick: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    aboutMe: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: false,
    },
    phoneNumberConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'US',
    },
    favActivities: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    delete_notification_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    badge_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM('silver','bronze','gold','platinum'),
      allowNull: true,
    },
    preferredTime: {
      type: DataTypes.ENUM('Week','Weekend','Both'),
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'users',
  }
);

module.exports = User;

Gender.hasMany(User);
User.belongsTo(Gender, { as: 'gender', foreignKey: 'genderId' });
User.belongsTo(Gender, { as: 'intrested', foreignKey: 'intrestedIn' }); 
