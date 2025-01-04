require('dotenv').config();
const { Client, IntentsBitField, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { initializeDatabase: initializeCountingDatabase } = require('./databaseSetup');
const { initializeDatabase: initializeModlogsDatabase } = require('./modlogsSetup');

const myIntents = new IntentsBitField([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates
]);

const client = new Client({ intents: myIntents });

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
        console.log(`Loaded command: ${command.data.name}`);
    } else {
        console.error(`Failed to load command in file: ${file}`);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        activities: [{ name: 'Snow! ❄️', type: ActivityType.Watching }],
        status: 'online',
    });

    // Register slash commands globally
    try {
        const registeredCommands = await client.application.commands.set(client.commands.map(cmd => ({
            name: cmd.data.name,
            description: cmd.data.description,
            options: cmd.data.options || [],
            type: cmd.data.type || 1, // Ensure the type is set for slash commands
            default_permission: false // Disable commands in DMs
        })));
        console.log('Global slash commands registered:', registeredCommands.map(cmd => cmd.name));
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

// Handle messages
client.on('messageCreate', (message) => {
    if (message.channel.type === 'dm' || !message.content.startsWith('.') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(`Received command: ${commandName}`);

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        if (command.executePrefix) {
            command.executePrefix(message, args);
            console.log(`Executed command: ${commandName}`);
        } else {
            message.reply('This command is only available as a slash command.');
        }
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.guild === null) {
        await interaction.reply('Commands are not available in DMs.');
        return;
    }

    console.log(`Received slash command: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        console.log(`Executed slash command: ${interaction.commandName}`);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

const counting = require('./commands/counting');
counting.countingLogic(client);

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

Promise.all([initializeCountingDatabase(), initializeModlogsDatabase()]).then(() => {
    client.login(process.env.TOKEN);
});
