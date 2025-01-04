const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping command to check bot response time'),
    async execute(interaction) {
        const start = Date.now();
        await interaction.reply('Pong!');
        const end = Date.now();
        const responseTime = end - start;
        await interaction.editReply(`Pong! ${responseTime}ms`);
    },
    async executePrefix(message) {
        const start = Date.now();
        message.channel.send('Pong!').then(sentMessage => {
            const end = Date.now();
            const responseTime = end - start;
            sentMessage.edit(`Pong! ${responseTime}ms`);
        });
    },
};
