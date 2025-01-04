const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const { Modlog } = require('../modlogsSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user for a specified duration')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to mute')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('The duration of the mute (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for muting the user')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || '';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply('That user is not in the server.');
        }

        const timeoutDuration = ms(duration);
        if (!timeoutDuration) {
            return interaction.reply('Invalid duration format. Please use a valid format like 10m, 1h, etc.');
        }

        try {
            await member.timeout(timeoutDuration, reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${target.tag} was muted. ${reason ? `| ${reason}` : ''}`);

            await interaction.reply({ embeds: [serverEmbed] });

            await Modlog.create({
                user: target.tag,
                action: 'mute',
                duration: duration,
                reason: reason,
                actionBy: interaction.user.tag,
                serverId: interaction.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were muted in ${interaction.guild.name} for ${duration}. ${reason ? `| ${reason}` : ''}`);
            if (target) {
                await target.send({ embeds: [dmEmbed] });
            }
        } catch (error) {
            console.error('Error muting user:', error);
            interaction.reply('An error occurred while trying to mute the user.');
        }
    },
    async executePrefix(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 2) {
            return message.reply('Please provide a user and duration to mute.');
        }

        const targetName = args[0].toLowerCase();
        const duration = args[1];
        const reason = args.slice(2).join(' ') || '';
        const member = message.guild.members.cache.find(m => 
            m.user.username.toLowerCase().includes(targetName) || 
            m.user.id === targetName || 
            m.user.tag.toLowerCase().includes(targetName) ||
            message.mentions.users.has(m.user.id)
        );

        if (!member) {
            return message.reply('User not found.');
        }

        const timeoutDuration = ms(duration);
        if (!timeoutDuration) {
            return message.reply('Invalid duration format. Please use a valid format like 10m, 1h, etc.');
        }

        try {
            await member.timeout(timeoutDuration, reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${member.user.tag} was muted. ${reason ? `| ${reason}` : ''}`);

            await message.channel.send({ embeds: [serverEmbed] });

            await Modlog.create({
                user: member.user.tag,
                action: 'mute',
                duration: duration,
                reason: reason,
                actionBy: message.author.tag,
                serverId: message.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were muted in ${message.guild.name} for ${duration}. ${reason ? `| ${reason}` : ''}`);
            if (member.user) {
                await member.user.send({ embeds: [dmEmbed] });
            }

            await message.delete();
        } catch (error) {
            console.error('Error muting user:', error);
            message.reply('An error occurred while trying to mute the user.');
        }
    },
};
