const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class likeActivities extends Model { }

likeActivities.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        likedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "likeActivities",
    }
);

module.exports = likeActivities;


