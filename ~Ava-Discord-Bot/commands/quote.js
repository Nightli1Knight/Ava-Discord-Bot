const { SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Fetches a random inspirational quote'),
    async execute(interaction) {
        try {
            const quote = await fetchQuote();
            await interaction.reply(`${quote.q} - ${quote.a}`);
        } catch (error) {
            console.error('ZenQuotes API failed:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Sorry, I couldn\'t fetch a quote right now.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Sorry, I couldn\'t fetch a quote right now.', ephemeral: true });
            }
        }
    },
    async executePrefix(message) {
        try {
            const quote = await fetchQuote();
            message.channel.send(`${quote.q} - ${quote.a}`);
        } catch (error) {
            console.error('ZenQuotes API failed:', error);
            message.channel.send('Sorry, I couldn\'t fetch a quote right now.');
        }
    },
};

async function fetchQuote(retries = 3) {
    const url = 'https://zenquotes.io/api/random';
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch from ZenQuotes API');
            const data = await response.json();
            return data[0];
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
