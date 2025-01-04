const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Modlog } = require('../modlogsSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || '';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply('That user is not in the server.');
        }

        try {
            await member.kick(reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${target.tag} was kicked. ${reason ? `| ${reason}` : ''}`);

            await interaction.reply({ embeds: [serverEmbed] });

            await Modlog.create({
                user: target.tag,
                action: 'kick',
                reason: reason,
                actionBy: interaction.user.tag,
                serverId: interaction.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were kicked from ${interaction.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await target.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }
        } catch (error) {
            console.error('Error kicking user:', error);
            interaction.reply('An error occurred while trying to kick the user.');
        }
    },
    async executePrefix(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 1) {
            return message.reply('Please provide a user to kick.');
        }

        const targetName = args[0].toLowerCase();
        const reason = args.slice(1).join(' ') || '';
        const member = message.guild.members.cache.find(m => 
            m.user.username.toLowerCase().includes(targetName) || 
            m.user.id === targetName || 
            m.user.tag.toLowerCase().includes(targetName) ||
            message.mentions.users.has(m.user.id)
        );

        if (!member) {
            return message.reply('User not found.');
        }

        try {
            await member.kick(reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${member.user.tag} was kicked. ${reason ? `| ${reason}` : ''}`);

            await message.channel.send({ embeds: [serverEmbed] });

            await Modlog.create({
                user: member.user.tag,
                action: 'kick',
                reason: reason,
                actionBy: message.author.tag,
                serverId: message.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were kicked from ${message.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await member.user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }

            await message.delete();
        } catch (error) {
            console.error('Error kicking user:', error);
            message.reply('An error occurred while trying to kick the user.');
        }
    },
};
