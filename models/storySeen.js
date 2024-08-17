const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class storySeen extends Model { }

storySeen.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        storyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        viewerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "storySeen",
    }
);

module.exports = storySeen;


