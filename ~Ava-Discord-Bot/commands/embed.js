const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create a custom embed message')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('The description of the embed (use \\n for new lines)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('color')
                .setDescription('The color of the embed (hex code)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('image')
                .setDescription('URL of the image to include')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('thumbnail')
                .setDescription('URL of the thumbnail to include')
                .setRequired(false)),
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description')?.replace(/\\n/g, '\n') || '';
        const color = interaction.options.getString('color') || '#0099ff';
        const image = interaction.options.getString('image') || null;
        const thumbnail = interaction.options.getString('thumbnail') || null;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);

        if (image && isValidURL(image)) {
            embed.setImage(image);
        }

        if (thumbnail && isValidURL(thumbnail)) {
            embed.setThumbnail(thumbnail);
        }

        await interaction.reply({ embeds: [embed] });
    }
};

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
