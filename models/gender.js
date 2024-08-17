const { DataTypes,Model }   = require('sequelize');
const sequelize             = require('../database/database');


class Gender extends Model {}

Gender.init({
  
  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement: true,
    primaryKey: true
  },
  type:{
    type:DataTypes.STRING,
    allowNull:false,
    default:'F'
  }

}, {
  sequelize,
  timestamps:false,
  modelName: 'genders',
});


module.exports = Gender;