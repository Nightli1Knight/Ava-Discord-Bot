const { SlashCommandBuilder } = require('discord.js');
const { fetch } = require('reddit-image-fetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Fetches a random meme'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const memes = await fetch({
                type: 'meme',
                total: 1,
                subreddit: ['dankmemes', 'memes', 'funny'] //add more subreddits if needed
            });
            await interaction.editReply({ files: [memes[0].image] });
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Sorry, I couldn\'t fetch a meme right now.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Sorry, I couldn\'t fetch a meme right now.', ephemeral: true });
            }
        }
    },
    async executePrefix(message) {
        try {
            const memes = await fetch({
                type: 'meme',
                total: 1,
                subreddit: ['dankmemes', 'memes', 'funny'] //add more subreddits if needed
            });
            message.channel.send({ files: [memes[0].image] });
        } catch (error) {
            console.error(error);
            message.channel.send('Sorry, I couldn\'t fetch a meme right now.');
        }
    },
};
