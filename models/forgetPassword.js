const { DataTypes,Model }   = require('sequelize');
const sequelize             = require('../database/database');


class ForgetPassword extends Model {}

ForgetPassword.init({
  
  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement: true,
    primaryKey: true
  },
  code:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  username:{
      type:DataTypes.STRING,
      allowNull:false 
  },
  email:{
      type:DataTypes.STRING,
  }

}, {
  sequelize,
  timestamps:false,
  modelName: 'forgetPasswords',
});


module.exports = ForgetPassword;