const { DataTypes,Model }   = require('sequelize');
const sequelize             = require('../database/database');


class LiveActivity extends Model {}

LiveActivity.init({
  
  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement: true,
    primaryKey: true
  },
  activityName:{
    type:DataTypes.STRING,
    allowNull:false
  },
  description:{
    type:DataTypes.STRING,
    allowNull:false
  },
  address:{
    type:DataTypes.STRING,
    allowNull:false
  },
  city:{
    type:DataTypes.STRING,
    allowNull:false
  },
  country:{
    type:DataTypes.STRING,
    allowNull:false
  },
  date:{
    type:DataTypes.DATE,
    allowNull:false
  },
  createdAt:{
    type:DataTypes.DATE,
    allowNull:false
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  delete_notification_status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

},

{
  sequelize,
  timestamps:false,
  modelName: 'liveActivities',
}
);

module.exports = LiveActivity;