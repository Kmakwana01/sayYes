const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class preferredActivities extends Model { }

preferredActivities.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "preferredActivities",
    }
);

module.exports = preferredActivities;


