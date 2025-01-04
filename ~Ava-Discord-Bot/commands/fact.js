const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Provides a random interesting fact'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en', { timeout: 5000 });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            await interaction.editReply(data.text);
        } catch (error) {
            console.error('Fetch error:', error);
            await interaction.editReply('There was an error while executing this command!');
        }
    },
    async executePrefix(message) {
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en', { timeout: 5000 });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            message.channel.send(data.text);
        } catch (error) {
            console.error('Fetch error:', error);
            message.channel.send('There was an error while executing this command!');
        }
    },
};
