const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server'),
    async execute(interaction) {
        const { guild } = interaction;

        await guild.members.fetch();
        await guild.channels.fetch();

        const { name, memberCount, premiumSubscriptionCount, channels, roles } = guild;
        const icon = guild.iconURL();
        const owner = await guild.fetchOwner();
        const ownerTag = `${owner.user.username}#${owner.user.discriminator}`;
        const createdAt = moment(guild.createdAt).format('dddd, D MMMM YYYY HH:mm');
        const createdAtRelative = moment(guild.createdAt).fromNow();

        const textChannels = channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = channels.cache.filter(c => c.type === 2).size;
        const categoryChannels = channels.cache.filter(c => c.type === 4).size;
        const threadChannels = channels.cache.filter(c => c.type === 11 || c.type === 12).size;

        const announcementChannel = channels.cache.find(c => c.type === 5);
        const announcementChannelLink = announcementChannel ? `<#${announcementChannel.id}>` : 'None';

        const explicitContentFilter = {
            0: 'Disabled',
            1: 'Enabled for members without roles',
            2: 'Enabled for all members'
        }[guild.explicitContentFilter] || 'None';

        const verificationLevel = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Highest'
        }[guild.verificationLevel] || 'None';

        const memberVerificationGate = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Highest'
        }[guild.verificationLevel] || 'None';

        const roleFields = [];
        let currentField = '';
        roles.cache.forEach(role => {
            const roleString = role.toString();
            if (currentField.length + roleString.length + 2 > 1024) {
                roleFields.push(currentField);
                currentField = roleString;
            } else {
                currentField += (currentField ? ', ' : '') + roleString;
            }
        });
        if (currentField) {
            roleFields.push(currentField);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: name, iconURL: icon })
            .setThumbnail(icon)
            .setColor('#DF922E')
            .addFields(
                { name: 'Overview', value: `> Owner: ${ownerTag}\n> Created: ${createdAt} (${createdAtRelative})\n> Members: ${memberCount}\n> Boosts: ${premiumSubscriptionCount}`, inline: false },
                { name: 'Channels', value: `> Announcement: ${announcementChannelLink}\n> Text Channels: ${textChannels}\n> Category Channels: ${categoryChannels}\n> Voice Channels: ${voiceChannels}\n> Thread Channels: ${threadChannels}`, inline: false },
                { name: 'Security', value: `> 2FA Settings: ${guild.mfaLevel ? 'Enabled' : 'Disabled'}\n> Verification Level: ${verificationLevel}\n> Explicit Content Filter: ${explicitContentFilter}\n> Member Verification Gate: ${memberVerificationGate}`, inline: false },
                { name: `Roles [${roles.cache.size}]`, value: roleFields.shift() || 'None', inline: false }
            );

        roleFields.forEach((field, index) => {
            embed.addFields({ name: `Roles (cont.)`, value: field, inline: false });
        });

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefix(message) {
        const { guild } = message;

        await guild.members.fetch();
        await guild.channels.fetch();

        const { name, memberCount, premiumSubscriptionCount, channels, roles } = guild;
        const icon = guild.iconURL();
        const owner = await guild.fetchOwner();
        const ownerTag = `${owner.user.username}#${owner.user.discriminator}`;
        const createdAt = moment(guild.createdAt).format('dddd, D MMMM YYYY HH:mm');
        const createdAtRelative = moment(guild.createdAt).fromNow();

        const textChannels = channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = channels.cache.filter(c => c.type === 2).size;
        const categoryChannels = channels.cache.filter(c => c.type === 4).size;
        const threadChannels = channels.cache.filter(c => c.type === 11 || c.type === 12).size;

        const announcementChannel = channels.cache.find(c => c.type === 5);
        const announcementChannelLink = announcementChannel ? `<#${announcementChannel.id}>` : 'None';

        const explicitContentFilter = {
            0: 'Disabled',
            1: 'Enabled for members without roles',
            2: 'Enabled for all members'
        }[guild.explicitContentFilter] || 'None';

        const verificationLevel = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Highest'
        }[guild.verificationLevel] || 'None';

        const memberVerificationGate = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Highest'
        }[guild.verificationLevel] || 'None';

        const roleFields = [];
        let currentField = '';
        roles.cache.forEach(role => {
            const roleString = role.toString();
            if (currentField.length + roleString.length + 2 > 1024) {
                roleFields.push(currentField);
                currentField = roleString;
            } else {
                currentField += (currentField ? ', ' : '') + roleString;
            }
        });
        if (currentField) {
            roleFields.push(currentField);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: name, iconURL: icon })
            .setThumbnail(icon)
            .setColor('#DF922E')
            .addFields(
                { name: 'Overview', value: `> Owner: ${ownerTag}\n> Created: ${createdAt} (${createdAtRelative})\n> Members: ${memberCount}\n> Boosts: ${premiumSubscriptionCount}`, inline: false },
                { name: 'Channels', value: `> Announcement: ${announcementChannelLink}\n> Text Channels: ${textChannels}\n> Category Channels: ${categoryChannels}\n> Voice Channels: ${voiceChannels}\n> Thread Channels: ${threadChannels}`, inline: false },
                { name: 'Security', value: `> 2FA Settings: ${guild.mfaLevel ? 'Enabled' : 'Disabled'}\n> Verification Level: ${verificationLevel}\n> Explicit Content Filter: ${explicitContentFilter}\n> Member Verification Gate: ${memberVerificationGate}`, inline: false },
                { name: `Roles [${roles.cache.size}]`, value: roleFields.shift() || 'None', inline: false }
            );

        roleFields.forEach((field, index) => {
            embed.addFields({ name: `Roles (cont.)`, value: field, inline: false });
        });

        await message.channel.send({ embeds: [embed] });
    }
};
