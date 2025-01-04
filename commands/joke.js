const { SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Fetches a random joke'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) throw new Error('Failed to fetch from official-joke-api');
            const joke = await response.json();
            await interaction.editReply(`${joke.setup} - ${joke.punchline}`);
        } catch (error) {
            console.error(error);
            try {
                const response = await fetch('https://v2.jokeapi.dev/joke/Any');
                const joke = await response.json();
                await interaction.editReply(`${joke.setup} - ${joke.delivery}`);
            } catch (error) {
                console.error(error);
                await interaction.editReply('Sorry, I couldn\'t fetch a joke right now.');
            }
        }
    },
    async executePrefix(message) {
        try {
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) throw new Error('Failed to fetch from official-joke-api');
            const joke = await response.json();
            message.channel.send(`${joke.setup} - ${joke.punchline}`);
        } catch (error) {
            console.error(error);
            try {
                const response = await fetch('https://v2.jokeapi.dev/joke/Any');
                const joke = await response.json();
                message.channel.send(`${joke.setup} - ${joke.delivery}`);
            } catch (error) {
                console.error(error);
                message.channel.send('Sorry, I couldn\'t fetch a joke right now.');
            }
        }
    },
};
