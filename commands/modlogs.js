const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./modlogs.sqlite');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('Displays moderation logs for a user')
        .addStringOption(option => 
            option.setName('user')
                .setDescription('The user to fetch mod logs for')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getString('user');
        const guildId = interaction.guild.id;

        db.all("SELECT * FROM modlogs WHERE user LIKE ? AND serverId = ?", [`%${user}%`, guildId], (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            if (rows.length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle(`Modlogs for ${interaction.client.users.cache.find(u => u.tag.includes(user) || u.id === user || u.username.includes(user))?.tag || user}`)
                    .setColor('#338dff')
                    .setThumbnail(interaction.client.users.cache.find(u => u.tag.includes(user) || u.id === user || u.username.includes(user))?.displayAvatarURL() || interaction.client.user.displayAvatarURL());

                const fields = rows.map(row => ({
                    name: `${row.action.charAt(0).toUpperCase() + row.action.slice(1)} by ${row.actionBy}`,
                    value: `Reason: ${row.reason}\nDuration: ${row.duration || 'N/A'}\nDate: ${new Date(row.timestamp).toLocaleString('en-GB', { timeZone: 'GMT' })} GMT`
                }));

                embed.addFields(fields);

                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply(`This user doesn't have any modlog at the moment.`);
            }
        });
    },
    async executePrefix(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 1) {
            return message.reply('Please provide a user to fetch mod logs for.');
        }

        const user = args[0];
        const guildId = message.guild.id;

        db.all("SELECT * FROM modlogs WHERE user LIKE ? AND serverId = ?", [`%${user}%`, guildId], (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            if (rows.length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle(`Modlogs for ${message.client.users.cache.find(u => u.tag.includes(user) || u.id === user || u.username.includes(user))?.tag || user}`)
                    .setColor('#338dff')
                    .setThumbnail(message.client.users.cache.find(u => u.tag.includes(user) || u.id === user || u.username.includes(user))?.displayAvatarURL() || message.client.user.displayAvatarURL());

                const fields = rows.map(row => ({
                    name: `${row.action.charAt(0).toUpperCase() + row.action.slice(1)} by ${row.actionBy}`,
                    value: `Reason: ${row.reason}\nDuration: ${row.duration || 'N/A'}\nDate: ${new Date(row.timestamp).toLocaleString('en-GB', { timeZone: 'GMT' })} GMT`
                }));

                embed.addFields(fields);

                message.channel.send({ embeds: [embed] });
            } else {
                message.reply(`This user doesn't have any modlog at the moment.`);
            }
        });
    },
};
