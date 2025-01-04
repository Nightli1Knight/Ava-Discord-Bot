const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Modlog } = require('../modlogsSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for banning the user')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || '';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply('That user is not in the server.');
        }

        try {
            await member.ban({ reason });
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${target.tag} was banned. ${reason ? `| ${reason}` : ''}`);

            await interaction.reply({ embeds: [serverEmbed] });

            await Modlog.create({
                user: target.tag,
                action: 'ban',
                reason: reason,
                actionBy: interaction.user.tag,
                serverId: interaction.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were banned from ${interaction.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await target.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }
        } catch (error) {
            console.error('Error banning user:', error);
            interaction.reply('An error occurred while trying to ban the user.');
        }
    },
    async executePrefix(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length < 1) {
            return message.reply('Please provide a user to ban.');
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
            await member.ban({ reason });
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${member.user.tag} was banned. ${reason ? `| ${reason}` : ''}`);

            await message.channel.send({ embeds: [serverEmbed] });

            await Modlog.create({
                user: member.user.tag,
                action: 'ban',
                reason: reason,
                actionBy: message.author.tag,
                serverId: message.guild.id
            });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were banned from ${message.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await member.user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }

            await message.delete();
        } catch (error) {
            console.error('Error banning user:', error);
            message.reply('An error occurred while trying to ban the user.');
        }
    },
};
