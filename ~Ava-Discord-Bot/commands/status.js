const { SlashCommandBuilder, EmbedBuilder, ActivityType } = require('discord.js');

const BOT_VERSION = process.env.BOT_VERSION || '1.0';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Displays the bot status and uptime'),
    async execute(interaction) {
        const uptime = process.uptime();
        const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
        const activity = interaction.client.user.presence.activities[0];
        const status = activity ? `${ActivityType[activity.type]}: ${activity.name}` : 'No status';

        const embed = new EmbedBuilder()
            .setTitle('Bot Status')
            .setColor('#DF922E')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'Uptime', value: uptimeString, inline: false },
                { name: 'Activity', value: status, inline: true },
                { name: 'Version', value: BOT_VERSION, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefix(message) {
        const uptime = process.uptime();
        const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
        const activity = message.client.user.presence.activities[0];
        const status = activity ? `${ActivityType[activity.type]}: ${activity.name}` : 'No status';

        const embed = new EmbedBuilder()
            .setTitle('Bot Status')
            .setColor('#DF922E')
            .setThumbnail(message.client.user.displayAvatarURL())
            .addFields(
                { name: 'Uptime', value: uptimeString, inline: false },
                { name: 'Activity', value: status, inline: true },
                { name: 'Version', value: BOT_VERSION, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    },
};
