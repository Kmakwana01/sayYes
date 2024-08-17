const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class matchUsers extends Model { }

matchUsers.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        matchedUserId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activityName : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isSeen : {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: true,
        modelName: "matchUsers",
    }
);

module.exports = matchUsers;


