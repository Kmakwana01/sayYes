const { DataTypes,Model }   = require('sequelize');
const sequelize             = require('../database/database');


class UserImage extends Model {}

UserImage.init({
  
  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement: true,
    primaryKey: true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    default:1
  },
  file:{
    type:DataTypes.STRING,
    allowNull:false,
    default:''
  },
  thumbnail:{
    type:DataTypes.STRING,
    allowNull:false,
    default:''
  },
  type:{
    type:DataTypes.STRING,
    allowNull:false,
    default:''
  },
  description : {
    type:DataTypes.STRING,
    allowNull:true,
    default:''
  },
  createdAt:{
    type:DataTypes.STRING,
    allowNull:false,
    default:''
  },
  updatedAt:{
    type:DataTypes.STRING,
    allowNull:false,
    default:''
  }


}, {
  sequelize,
  timestamps:false,
  modelName: 'userFiles',
});


module.exports = UserImage;