const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'modlogs.sqlite'
});

const Modlog = sequelize.define('Modlog', {
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    actionBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serverId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

async function initializeDatabase() {
    await sequelize.sync();
    console.log('Database and table created!');
}

module.exports = { Modlog, initializeDatabase };
