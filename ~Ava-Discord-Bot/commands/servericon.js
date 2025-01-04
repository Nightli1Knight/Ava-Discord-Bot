const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Get the server icon'),
    name: 'servericon',
    description: 'Get the server icon',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Server Icon`)
            .setImage(interaction.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#DF922E');

        await interaction.reply({ embeds: [embed] });
    },
    executePrefix(message) {
        const embed = new EmbedBuilder()
            .setTitle(`${message.guild.name} Server Icon`)
            .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#DF922E');

        message.channel.send({ embeds: [embed] });
    },
};
