const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Displays information about a role')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to get information about')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const permissions = role.permissions.toArray().map(perm => perm.replace(/_/g, ' ').toLowerCase()).join(', ');
        const formattedPermissions = permissions.split(', ').map(perm => perm.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ');

        const currentTimeGMT = moment().tz('GMT').format('DD/MM/YYYY HH:mm [GMT]');

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTitle('Role Information')
            .setColor('#DF922E')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: role.id, inline: false },
                { name: 'Color', value: role.hexColor, inline: false },
                { name: 'Created At', value: role.createdAt.toDateString(), inline: false },
                { name: 'Members', value: role.members.size.toString(), inline: false },
                { name: 'Special Role', value: role.permissions.has(PermissionsBitField.Flags.Administrator) ? 'Administrator' : role.permissions.has(PermissionsBitField.Flags.ManageMessages) ? 'Moderator' : 'None', inline: false },
                { name: 'Role Permissions', value: formattedPermissions.replace(/Useembeddedactivities/g, 'Use embedded activities') || 'None', inline: false }
            )
            .setFooter({ text: `${currentTimeGMT}` });

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefix(message, args) {
        const roleName = args.join(' ').toLowerCase();
        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(roleName)) || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply('Role not found!');

        const permissions = role.permissions.toArray().map(perm => perm.replace(/_/g, ' ').toLowerCase()).join(', ');
        const formattedPermissions = permissions.split(', ').map(perm => perm.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ');

        const currentTimeGMT = moment().tz('GMT').format('DD/MM/YYYY HH:mm [GMT]');

        const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
            .setTitle('Role Information')
            .setColor('#DF922E')
            .setThumbnail(message.client.user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: role.id, inline: false },
                { name: 'Color', value: role.hexColor, inline: false },
                { name: 'Created At', value: role.createdAt.toDateString(), inline: false },
                { name: 'Members', value: role.members.size.toString(), inline: false },
                { name: 'Special Role', value: role.permissions.has(PermissionsBitField.Flags.Administrator) ? 'Administrator' : role.permissions.has(PermissionsBitField.Flags.ManageMessages) ? 'Moderator' : 'None', inline: false },
                { name: 'Role Permissions', value: formattedPermissions.replace(/Useembeddedactivities/g, 'Use embedded activities') || 'None', inline: false }
            )
            .setFooter({ text: `${currentTimeGMT}` });

        message.channel.send({ embeds: [embed] });
    },
};
