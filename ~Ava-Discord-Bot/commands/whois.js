const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Displays information about a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to get information about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply('User not found.');
        }

        const roles = member.roles.cache.map(role => role.toString()).join(', ');
        const joinedServer = moment(member.joinedAt).format('dddd, D MMMM YYYY HH:mm');
        const joinedDiscord = moment(member.user.createdAt).format('dddd, D MMMM YYYY HH:mm');
        const currentTimeGMT = moment().tz('GMT').format('DD/MM/YYYY HH:mm [GMT]');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL() })
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#DF922E')
            .addFields(
                { name: 'Roles', value: roles || 'None', inline: false }
            )
            .setFooter({ text: `ID: ${member.id} • ${currentTimeGMT}` });

        if (member.id === interaction.guild.ownerId) {
            embed.addFields({ name: 'Special Role', value: 'Server Owner', inline: false });
        } else if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            embed.addFields({ name: 'Special Role', value: 'Administrator', inline: false });
        } else if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            embed.addFields({ name: 'Special Role', value: 'Moderator', inline: false });
        }

        embed.addFields(
            { name: 'Joined Server', value: joinedServer, inline: true },
            { name: 'Joined Discord', value: joinedDiscord, inline: true }
        );

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefix(message) {
        const input = message.content.split(' ').slice(1).join(' ');
        let member;

        if (input) {
            member = message.guild.members.cache.find(m => 
                m.user.username.toLowerCase().includes(input.toLowerCase()) || 
                m.id === input
            );
        } else {
            member = message.member;
        }

        if (!member) {
            return message.reply('User not found.');
        }

        const roles = member.roles.cache.map(role => role.toString()).join(', ');
        const joinedServer = moment(member.joinedAt).format('dddd, D MMMM YYYY HH:mm');
        const joinedDiscord = moment(member.user.createdAt).format('dddd, D MMMM YYYY HH:mm');
        const currentTimeGMT = moment().tz('GMT').format('DD/MM/YYYY HH:mm [GMT]');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.displayAvatarURL() })
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#DF922E')
            .addFields(
                { name: 'Roles', value: roles || 'None', inline: false }
            )
            .setFooter({ text: `ID: ${member.id} • ${currentTimeGMT}` });

        if (member.id === message.guild.ownerId) {
            embed.addFields({ name: 'Special Role', value: 'Server Owner', inline: false });
        } else if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            embed.addFields({ name: 'Special Role', value: 'Administrator', inline: false });
        } else if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            embed.addFields({ name: 'Special Role', value: 'Moderator', inline: false });
        }

        embed.addFields(
            { name: 'Joined Server', value: joinedServer, inline: true },
            { name: 'Joined Discord', value: joinedDiscord, inline: true }
        );

        message.channel.send({ embeds: [embed] });
    },
};
