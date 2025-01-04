const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const commands = [
    {
        name: 'joke',
        description: 'Fetches a random joke',
    },
    {
        name: 'meme',
        description: 'Fetches a random meme',
    },
    {
        name: 'quote',
        description: 'Fetches a random inspirational quote',
    },
    {
        name: 'purge',
        description: 'Deletes a specified number of messages from the channel',
        options: [
            {
                name: 'amount',
                type: ApplicationCommandOptionType.Integer,
                description: 'The number of messages to delete',
                required: true,
            },
        ],
    },
    {
        name: 'serverinfo',
        description: 'Displays information about the server',
    },
    {
        name: 'whois',
        description: 'Displays information about a user',
        options: [
            {
                name: 'user',
                type: ApplicationCommandOptionType.User,
                description: 'The user to get information about',
                required: false,
            },
        ],
    },
    {
        name: 'ping',
        description: 'Ping command to check bot response time',
    },
    {
        name: 'status',
        description: 'Displays the bot status and uptime',
    },
    {
        name: 'dadjoke',
        description: 'Displays a random dad joke',
    },
    {
        name: 'roleinfo',
        description: 'Displays information about a role',
        options: [
            {
                name: 'role',
                type: ApplicationCommandOptionType.Role,
                description: 'The role to get information about',
                required: true,
            },
        ],
    },
    {
        name: 'avatar',
        description: 'Displays the avatar of a user',
        options: [
            {
                name: 'user',
                type: ApplicationCommandOptionType.User,
                description: 'The user to get the avatar of',
                required: false,
            },
        ],
    },
    {
        name: 'fact',
        description: 'Provides a random interesting fact',
    },
    {
        name: 'gif',
        description: 'Searches for a GIF',
        options: [
            {
                name: 'keyword',
                type: ApplicationCommandOptionType.String,
                description: 'The keyword to search for',
                required: true,
            },
        ],
    },
    {
        name: 'choose',
        description: 'Randomly chooses one of the provided options',
        options: [
            {
                name: 'option1',
                type: ApplicationCommandOptionType.String,
                description: 'First option',
                required: true,
            },
            {
                name: 'option2',
                type: ApplicationCommandOptionType.String,
                description: 'Second option',
                required: true,
            },
            {
                name: 'option3',
                type: ApplicationCommandOptionType.String,
                description: 'Third option',
                required: false,
            },
            {
                name: 'option4',
                type: ApplicationCommandOptionType.String,
                description: 'Fourth option',
                required: false,
            },
            {
                name: 'option5',
                type: ApplicationCommandOptionType.String,
                description: 'Fifth option',
                required: false,
            },
        ],
    },
    {
        name: 'servericon',
        description: 'Get the server icon',
    },
    {
        name: 'serverbanner',
        description: 'Get the server banner',
    },
    {
        name: 'setupcounting',
        description: 'Set the counting channel',
        options: [
            {
                name: 'channel',
                type: ApplicationCommandOptionType.Channel,
                description: 'The channel to count in',
                required: true,
            },
        ],
    },
    {
        name: 'kick',
        description: 'Kicks a user from the server',
        options: [
            {
                name: 'target',
                type: ApplicationCommandOptionType.User,
                description: 'The user to kick',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'The reason for kicking the user',
                required: false,
            },
        ],
    },
    {
        name: 'ban',
        description: 'Bans a user from the server',
        options: [
            {
                name: 'target',
                type: ApplicationCommandOptionType.User,
                description: 'The user to ban',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'The reason for banning the user',
                required: false,
            },
        ],
    },
    {
        name: 'mute',
        description: 'Mutes a user for a specified duration',
        options: [
            {
                name: 'target',
                type: ApplicationCommandOptionType.User,
                description: 'The user to mute',
                required: true,
            },
            {
                name: 'duration',
                type: ApplicationCommandOptionType.String,
                description: 'The duration of the mute (e.g., 10m, 1h)',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'The reason for muting the user',
                required: false,
            },
        ],
    },
    {
        name: 'unmute',
        description: 'Unmutes a user',
        options: [
            {
                name: 'target',
                type: ApplicationCommandOptionType.User,
                description: 'The user to unmute',
                required: true,
            },
        ],
    },
    {
        name: 'unban',
        description: 'Unbans a user from the server',
        options: [
            {
                name: 'userid',
                type: ApplicationCommandOptionType.String,
                description: 'The ID of the user to unban',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'The reason for unbanning the user',
                required: false,
            },
        ],
    },
    {
        name: 'help',
        description: 'Displays a list of available commands and information',
    },
    {
        name: 'say',
        description: 'Make the bot say something',
        options: [
            {
                name: 'message',
                type: ApplicationCommandOptionType.String,
                description: 'The message to say',
                required: true,
            },
        ],
    },
    {
        name: 'embed',
        description: 'Create a custom embed message',
        options: [
            {
                name: 'title',
                type: ApplicationCommandOptionType.String,
                description: 'The title of the embed',
                required: true,
            },
            {
                name: 'description',
                type: ApplicationCommandOptionType.String,
                description: 'The description of the embed',
                required: false,
            },
            {
                name: 'color',
                type: ApplicationCommandOptionType.String,
                description: 'The color of the embed (hex code)',
                required: false,
            },
            {
                name: 'image',
                type: ApplicationCommandOptionType.String,
                description: 'URL of the image to include',
                required: false,
            },
            {
                name: 'thumbnail',
                type: ApplicationCommandOptionType.String,
                description: 'URL of the thumbnail to include',
                required: false,
            },
        ],
    },
    {
        name: 'modlogs',
        description: 'Displays moderation logs for a user',
        options: [
            {
                name: 'user',
                type: ApplicationCommandOptionType.String,
                description: 'The user to fetch mod logs for',
                required: true,
            },
        ],
    },
    {
        name: 'weather',
        description: 'Get the current weather for a specified location',
        options: [
            {
                name: 'location',
                type: ApplicationCommandOptionType.String,
                description: 'The location to get the weather for',
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
