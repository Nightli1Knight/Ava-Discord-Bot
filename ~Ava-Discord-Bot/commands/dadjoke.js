const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dadjoke')
        .setDescription('Displays a random dad joke'),
    async execute(interaction) {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        await interaction.reply(data.joke);
    },
    async executePrefix(message) {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        message.channel.send(data.joke);
    },
};
