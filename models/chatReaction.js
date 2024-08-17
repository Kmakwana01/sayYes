const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../database/database");

class chatReaction extends Model { }

chatReaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reaction: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "chatReactions",
    }
);

module.exports = chatReaction;


