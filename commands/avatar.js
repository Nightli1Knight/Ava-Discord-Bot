const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to get the avatar of')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#DF922E');

        await interaction.reply({ embeds: [embed] });
    },
    async executePrefix(message, args) {
        const query = args.join(' ').toLowerCase();
        const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(query)) || message.guild.members.cache.get(args[0]) || message.member;
        const user = member ? member.user : message.author;

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#DF922E');

        message.channel.send({ embeds: [embed] });
    },
};
