const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for unbanning the user')
                .setRequired(false)),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || '';

        try {
            await interaction.guild.members.unban(userId, reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`User with ID ${userId} was unbanned. ${reason ? `| ${reason}` : ''}`);

            await interaction.reply({ embeds: [serverEmbed] });

            const user = await interaction.client.users.fetch(userId);
            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were unbanned from ${interaction.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            await interaction.reply('There was an error while unbanning the user.');
        }
    },
    async executePrefix(message, args) {
        if (args.length < 1) {
            return message.reply('Please provide a user ID to unban.');
        }

        const userId = args[0];
        const reason = args.slice(1).join(' ') || '';

        try {
            await message.guild.members.unban(userId, reason);
            const serverEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`User with ID ${userId} was unbanned. ${reason ? `| ${reason}` : ''}`);

            await message.channel.send({ embeds: [serverEmbed] });

            const user = await message.client.users.fetch(userId);
            const dmEmbed = new EmbedBuilder()
                .setColor('#338dff')
                .setDescription(`You were unbanned from ${message.guild.name}. ${reason ? `| ${reason}` : ''}`);
            try {
                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
            }

            await message.delete();
        } catch (error) {
            console.error('Error unbanning user:', error);
            await message.reply('There was an error while unbanning the user.');
        }
    },
};
