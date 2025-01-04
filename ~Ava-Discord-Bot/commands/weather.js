const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather for a specified location')
        .addStringOption(option => 
            option.setName('location')
                .setDescription('The location to get the weather for')
                .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const apiKey = process.env.WEATHER_API_KEY;

        try {
            const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
            const weatherData = response.data;

            const weatherEmbed = new EmbedBuilder()
                .setColor('#DF922E')
                .setTitle(`Weather in ${weatherData.location.name}`)
                .setDescription(`**${weatherData.current.condition.text}**`)
                .addFields(
                    { name: 'Temperature', value: `${weatherData.current.temp_c}°C`, inline: true },
                    { name: 'Feels Like', value: `${weatherData.current.feelslike_c}°C`, inline: true },
                    { name: 'Humidity', value: `${weatherData.current.humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${weatherData.current.wind_kph} kph`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Weather data provided by WeatherAPI' });

            await interaction.reply({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.reply('Sorry, I couldn\'t fetch the weather data. Please try again later.');
        }
    },
    async executePrefix(message, args) {
        const location = args.join(' ');
        const apiKey = process.env.WEATHER_API_KEY;

        if (!location) {
            return message.reply('Please provide a location to get the weather for.');
        }

        try {
            const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
            const weatherData = response.data;

            const weatherEmbed = new EmbedBuilder()
                .setColor('#DF922E')
                .setTitle(`Weather in ${weatherData.location.name}`)
                .setDescription(`**${weatherData.current.condition.text}**`)
                .addFields(
                    { name: 'Temperature', value: `${weatherData.current.temp_c}°C`, inline: true },
                    { name: 'Feels Like', value: `${weatherData.current.feelslike_c}°C`, inline: true },
                    { name: 'Humidity', value: `${weatherData.current.humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${weatherData.current.wind_kph} kph`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Weather data provided by WeatherAPI' });

            await message.channel.send({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            message.reply('Sorry, I couldn\'t fetch the weather data. Please try again later.');
        }
    }
};
