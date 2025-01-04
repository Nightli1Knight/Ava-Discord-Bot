const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages from the channel')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The number of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');
        if (isNaN(amount) || amount <= 0) {
            return interaction.reply({ content: 'Please provide a valid number of messages to delete.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
        });

        interaction.reply(`Successfully deleted ${amount} messages.`);
    },
    async executePrefix(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please provide a valid number of messages to delete.');
        }

        await message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error trying to purge messages in this channel!');
        });
    },
};
