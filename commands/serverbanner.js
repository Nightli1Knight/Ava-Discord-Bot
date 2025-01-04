const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverbanner')
        .setDescription('Get the server banner'),
    name: 'serverbanner',
    description: 'Get the server banner',
    async execute(interaction) {
        const bannerURL = interaction.guild.bannerURL({ dynamic: true, size: 512 });
        if (bannerURL) {
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} Server Banner`)
                .setImage(bannerURL)
                .setColor('#DF922E');

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('This server does not have a banner.');
        }
    },
    executePrefix(message) {
        const bannerURL = message.guild.bannerURL({ dynamic: true, size: 512 });
        if (bannerURL) {
            const embed = new EmbedBuilder()
                .setTitle(`${message.guild.name} Server Banner`)
                .setImage(bannerURL)
                .setColor('#DF922E');

            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send('This server does not have a banner.');
        }
    },
};
