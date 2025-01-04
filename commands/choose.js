const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Randomly chooses one of the provided options')
        .addStringOption(option => 
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option3')
                .setDescription('Third option')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('option4')
                .setDescription('Fourth option')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('option5')
                .setDescription('Fifth option')
                .setRequired(false)),
    async execute(interaction) {
        const options = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
            interaction.options.getString('option5')
        ].filter(option => option !== null && option.toLowerCase() !== 'or');

        const choice = options[Math.floor(Math.random() * options.length)];
        await interaction.reply(`I choose: ${choice}`);
    },
    async executePrefix(message, args) {
        const filteredArgs = args.filter(arg => arg.toLowerCase() !== 'or');

        if (filteredArgs.length < 2) {
            return message.reply('Please provide at least two options.');
        }

        const choice = filteredArgs[Math.floor(Math.random() * filteredArgs.length)];
        message.channel.send(`I choose: ${choice}`);
    },
};
