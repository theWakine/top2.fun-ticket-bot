import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Logger } from '@/modules/logger/Logger';

const logger = new Logger('logs/app.log');

export async function deployCommands(client) {
    const { SlashCommandBuilder } = require('discord.js');

    dotenv.config();

    const commands = [
    new SlashCommandBuilder()
        .setName('addurlchecker')
        .setDescription('Add a url checker to the server')
        .addStringOption(option => option.setName('url').setDescription('The url to check').setRequired(true)),

        new SlashCommandBuilder()
        .setName('removeurlchecker')
        .setDescription('Remove a url checker from the server')
        .addStringOption(option => option.setName('url').setDescription('The url to remove').setRequired(true)),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
    
(async () => {
    try {
        logger.info('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
            { body: commands },
        );

        logger.info('Successfully reloaded application (/) commands.');
    } catch (error) {
        logger.error(error);
    }
})();
}
