const { DataTypes, Model,Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class hashTags extends Model { }

hashTags.init(
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
        name: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "hashTags",
    }
);

module.exports = hashTags;


