const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class interested extends Model { }

interested.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        interestedByProfileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        interestedToProfileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isSeen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        sequelize,
        timestamps: true,
        modelName: "interestedActivities",
    }
);

module.exports = interested;


