const { DataTypes,Model }   = require('sequelize');
const sequelize             = require('../database/database');


class UserActivity extends Model {}

UserActivity.init({
  
  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement: true,
    primaryKey: true
  },
  sentBy:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  sentTo:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  latitude:{
    type:DataTypes.DECIMAL(6,4),
    allowNull:false
  },

  longitude:{
    type:DataTypes.DECIMAL(6,4),
    allowNull:false
  },
  activityId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  activityTime:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  address:{
    type:DataTypes.STRING,
    allowNull:false
  },
  createdAt:{
    type:DataTypes.DATE,
    allowNull:false
  },
  isAccepted:{
    type:DataTypes.BOOLEAN,
    allowNull:true,
    defaultValue:false
  },
  clientResponse:{
    type:DataTypes.BOOLEAN,
    allowNull:true
  }


}, {
  sequelize,
  timestamps:false,
  modelName: 'userActivities',
});


module.exports = UserActivity;