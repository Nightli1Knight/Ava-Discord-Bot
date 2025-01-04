const { SlashCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to say')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        if (!message) {
            return interaction.reply({ content: 'You need to provide a message for me to say!', ephemeral: true });
        }

        await interaction.channel.send(message);

        await interaction.reply({ content: 'Message sent!', ephemeral: true });
    },
    async executePrefix(message, args) {
        const sayMessage = args.join(' ');

        if (!sayMessage) {
            return message.reply('You need to provide a message for me to say!');
        }
        
        await message.delete();

        await message.channel.send(sayMessage);
    },
};
