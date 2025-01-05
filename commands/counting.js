const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CountingChannel } = require('../databaseSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupcounting')
        .setDescription('Set the counting channel')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to count in')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const existingChannel = await CountingChannel.findOne({ where: { guildId: interaction.guild.id } });

        if (existingChannel && existingChannel.channelId !== channel.id) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('✅')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('❌')
                        .setStyle(ButtonStyle.Danger)
                );

            const embed = new EmbedBuilder()
                .setColor('#DF922E')
                .setTitle('Change Counting Channel')
                .setDescription(`Counting channel is already set to <#${existingChannel.channelId}>. Do you want to change it to ${channel}?`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm') {
                    await CountingChannel.upsert({
                        guildId: interaction.guild.id,
                        channelId: channel.id,
                        lastNumber: 0,
                        lastUser: null
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#DF922E')
                        .setTitle('Counting Channel Changed')
                        .setDescription(`Counting channel has been changed to ${channel}`)
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

                    await i.update({ embeds: [embed], components: [] });
                } else {
                    await i.update({ content: 'Counting channel change canceled.', components: [], ephemeral: true });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'No response received. Counting channel change canceled.', components: [], ephemeral: true });
                }
            });
        } else {
            await CountingChannel.upsert({
                guildId: interaction.guild.id,
                channelId: channel.id,
                lastNumber: 0,
                lastUser: null
            });

            const embed = new EmbedBuilder()
                .setColor('#DF922E')
                .setTitle('Counting Channel Set')
                .setDescription(`Counting channel has been set to ${channel}`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
    async executePrefix(message, args) {
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const channel = message.mentions.channels.first();
            if (!channel) {
                const embed = new EmbedBuilder()
                    .setColor('#DF922E')
                    .setTitle('Setup Counting Channel')
                    .setDescription('Please mention a valid channel. Usage: `.setupcounting #channelname`')
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

                return message.channel.send({ embeds: [embed] });
            }

            const existingChannel = await CountingChannel.findOne({ where: { guildId: message.guild.id } });

            if (existingChannel && existingChannel.channelId !== channel.id) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setLabel('✅')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('cancel')
                            .setLabel('❌')
                            .setStyle(ButtonStyle.Danger)
                    );

                const embed = new EmbedBuilder()
                    .setColor('#DF922E')
                    .setTitle('Change Counting Channel')
                    .setDescription(`Counting channel is already set to <#${existingChannel.channelId}>. Do you want to change it to ${channel}?`)
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

                const msg = await message.channel.send({ embeds: [embed], components: [row] });

                const filter = i => i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirm') {
                        await CountingChannel.upsert({
                            guildId: message.guild.id,
                            channelId: channel.id,
                            lastNumber: 0,
                            lastUser: null
                        });

                        const embed = new EmbedBuilder()
                            .setColor('#DF922E')
                            .setTitle('Counting Channel Changed')
                            .setDescription(`Counting channel has been changed to ${channel}`)
                            .setThumbnail(message.client.user.displayAvatarURL())
                            .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

                        await i.update({ embeds: [embed], components: [] });
                    } else {
                        await i.update({ content: 'Counting channel change canceled.', components: [] });
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        msg.edit({ content: 'No response received. Counting channel change canceled.', components: [] });
                    }
                });
            } else {
                await CountingChannel.upsert({
                    guildId: message.guild.id,
                    channelId: channel.id,
                    lastNumber: 0,
                    lastUser: null
                });

                const embed = new EmbedBuilder()
                    .setColor('#DF922E')
                    .setTitle('Counting Channel Set')
                    .setDescription(`Counting channel has been set to ${channel}`)
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

                message.channel.send({ embeds: [embed] });
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor('#DF922E')
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to use this command.')
                .setThumbnail(message.client.user.displayAvatarURL())
                .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });
        }
    }
};

// Counting logic
module.exports.countingLogic = (client) => {
    const warnedUsers = new Set();

    client.on('messageCreate', async message => {
        if (message.author.bot) return;

        const countingChannel = await CountingChannel.findOne({ where: { guildId: message.guild.id } });
        if (countingChannel && message.channel.id === countingChannel.channelId) {
            const content = message.content.replace(/\s+/g, '');
            if (/^\d+$/.test(content)) {
                const number = parseInt(content, 10);
                if (number === countingChannel.lastNumber + 1) {
                    if (message.author.id === countingChannel.lastUser) {
                        if (!warnedUsers.has(message.author.id)) {
                            warnedUsers.add(message.author.id);
                            await message.react('⚠️');
                            await message.channel.send(`<@${message.author.id}>, you cannot count consecutively!`);
                        } else {
                            await message.react('⚠️');
                            await message.channel.send(`<@${message.author.id}>, Incorrect number! Starting over from 1.`);
                            countingChannel.lastNumber = 0;
                            countingChannel.lastUser = null;
                            await countingChannel.save();
                        }
                    } else {
                        countingChannel.lastNumber = number;
                        countingChannel.lastUser = message.author.id;
                        await countingChannel.save();
                        await message.react('✅');
                    }
                } else {
                    await message.react('❌');
                    await message.channel.send(`<@${message.author.id}>, Incorrect number! Starting over from 1.`);
                    countingChannel.lastNumber = 0;
                    countingChannel.lastUser = null;
                    await countingChannel.save();
                }
            } else {
                await message.delete();
                await message.channel.send(`<@${message.author.id}>, Only numbers are allowed in this channel.`);
            }
        }
    });
};
