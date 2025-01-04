const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const CountingChannel = sequelize.define('CountingChannel', {
    guildId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastUser: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

async function initializeDatabase() {
    await sequelize.sync();
}

module.exports = { CountingChannel, initializeDatabase };
