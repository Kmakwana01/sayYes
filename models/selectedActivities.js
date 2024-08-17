const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class selectedActivities extends Model { }

selectedActivities.init(
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
        preferredActivityId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "selectedActivities",
    }
);

module.exports = selectedActivities;


