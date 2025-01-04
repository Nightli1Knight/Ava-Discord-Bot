const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Displays a list of available commands and information',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.displayAvatarURL();

        const helpEmbed = new EmbedBuilder()
            .setColor('#DF922E')
            .setTitle('All Commands')
            .setDescription('Here are the available commands:')
            .setThumbnail(botAvatarURL)
            .addFields(
                { name: 'joke', value: 'Fetches a random joke' },
                { name: 'meme', value: 'Fetches a random meme' },
                { name: 'quote', value: 'Fetches a random inspirational quote' },
                { name: 'purge', value: 'Deletes a specified number of messages from the channel' },
                { name: 'serverinfo', value: 'Displays information about the server' },
                { name: 'whois', value: 'Displays information about a user' },
                { name: 'ping', value: 'Ping command to check bot response time' },
                { name: 'status', value: 'Displays the bot status and uptime' },
                { name: 'dadjoke', value: 'Displays a random dad joke' },
                { name: 'roleinfo', value: 'Displays information about a role' },
                { name: 'avatar', value: 'Displays the avatar of a user' },
                { name: 'fact', value: 'Provides a random interesting fact' },
                { name: 'gif', value: 'Searches for a GIF' },
                { name: 'choose', value: 'Randomly chooses one of the provided options' },
                { name: 'servericon', value: 'Get the server icon' },
                { name: 'serverbanner', value: 'Get the server banner' }
                //add more commands here (optional)
            )
            .setFooter({ text: 'Use the prefix "." or "/" before each command.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Visit our Discord Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/')
                    .setEmoji('💬'),
                new ButtonBuilder()
                    .setLabel('Buy Me a Coffee')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://www.buymeacoffee.com/')
                    .setEmoji('☕')
            );

        await interaction.reply({ embeds: [helpEmbed], components: [row] });
    },
    async executePrefix(message, args) {
        const botAvatarURL = message.client.user.displayAvatarURL();

        const helpEmbed = new EmbedBuilder()
            .setColor('#DF922E')
            .setTitle('All Commands')
            .setDescription('Here are the available commands:')
            .setThumbnail(botAvatarURL)
            .addFields(
                { name: 'joke', value: 'Fetches a random joke' },
                { name: 'meme', value: 'Fetches a random meme' },
                { name: 'quote', value: 'Fetches a random inspirational quote' },
                { name: 'purge', value: 'Deletes a specified number of messages from the channel' },
                { name: 'serverinfo', value: 'Displays information about the server' },
                { name: 'whois', value: 'Displays information about a user' },
                { name: 'ping', value: 'Ping command to check bot response time' },
                { name: 'status', value: 'Displays the bot status and uptime' },
                { name: 'dadjoke', value: 'Displays a random dad joke' },
                { name: 'roleinfo', value: 'Displays information about a role' },
                { name: 'avatar', value: 'Displays the avatar of a user' },
                { name: 'fact', value: 'Provides a random interesting fact' },
                { name: 'gif', value: 'Searches for a GIF' },
                { name: 'choose', value: 'Randomly chooses one of the provided options' },
                { name: 'servericon', value: 'Get the server icon' },
                { name: 'serverbanner', value: 'Get the server banner' }
            )
            .setFooter({ text: 'Use the prefix "." or "/" before each command.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Visit our Discord Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/')
                    .setEmoji('💬'),
                new ButtonBuilder()
                    .setLabel('Buy Me a Coffee')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://www.buymeacoffee.com/')
                    .setEmoji('☕')
            );

        await message.channel.send({ embeds: [helpEmbed], components: [row] });
    },
};
