const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Searches for a GIF')
        .addStringOption(option => 
            option.setName('keyword')
                .setDescription('The keyword to search for')
                .setRequired(true)),
    async execute(interaction) {
        const fetch = (await import('node-fetch')).default;
        const keyword = interaction.options.getString('keyword');

        // Acknowledge the interaction immediately
        await interaction.deferReply();

        try {
            const response = await fetch(`Put here giphy.com API`);
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                await interaction.editReply({ files: [data.data[0].images.original.url] });
            } else {
                await interaction.editReply('No GIFs found for your keyword.');
            }
        } catch (error) {
            console.error('Error fetching GIF:', error);
            await interaction.editReply('There was an error while executing this command.');
        }
    },
    async executePrefix(message, args) {
        if (args.length === 0) {
            return message.reply('Please provide a keyword to search for a GIF.');
        }
        const fetch = (await import('node-fetch')).default;
        const keyword = args.join(' ');
        try {
            const response = await fetch(`Put here giphy.com API`);
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                message.channel.send({ files: [data.data[0].images.original.url] });
            } else {
                message.channel.send('No GIFs found for your keyword.');
            }
        } catch (error) {
            console.error('Error fetching GIF:', error);
            message.channel.send('There was an error while executing this command.');
        }
    },
};