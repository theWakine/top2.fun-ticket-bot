const { REST, Routes } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with Hello, World!'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
