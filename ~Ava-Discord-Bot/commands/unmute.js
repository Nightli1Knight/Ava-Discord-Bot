const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to unmute')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (member) {
            await member.timeout(null);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${target.tag} was unmuted.`);

            await interaction.reply({ embeds: [serverEmbed] });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were unmuted in ${interaction.guild.name}.`);
            if (target) {
                await target.send({ embeds: [dmEmbed] });
            }
        } else {
            await interaction.reply('That user is not in the server.');
        }
    },
    async executePrefix(message, args) {
        if (args.length < 1) {
            return message.reply('Please provide a user to unmute.');
        }

        const targetName = args[0].toLowerCase();
        const member = message.guild.members.cache.find(m => 
            m.user.username.toLowerCase().includes(targetName) || 
            m.user.id === targetName || 
            m.user.tag.toLowerCase().includes(targetName) ||
            message.mentions.users.has(m.user.id)
        );

        if (member) {
            await member.timeout(null);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`${member.user.tag} was unmuted.`);

            await message.channel.send({ embeds: [serverEmbed] });

            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were unmuted in ${message.guild.name}.`);
            if (member.user) {
                await member.user.send({ embeds: [dmEmbed] });
            }

            await message.delete();
        } else {
            await message.reply('User not found.');
        }
    },
};
