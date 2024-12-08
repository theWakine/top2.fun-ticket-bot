import Database from '@/database/database';
import { Logger } from '@/modules/logger/Logger';
import { loadConfig, AppConfig } from '@/configs/app.config';
import { createEmbed } from "@/modules/discord/utils/embed";

const logger = new Logger('logs/commands/urlchecker.log');
let config = loadConfig();

export async function deployCommandsInit(client) {
    const database = new Database();
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const cmd = interaction.commandName;
        if (cmd === 'addurlchecker') {
            try {
                if (interaction.member.roles.cache.has(config.Client.Role.urlchecker_moderator)) {
                    const url = interaction.options.getString('url');
                    if (await database.getUrls({url: url})) {
                        logger.info(`Url ${url} already exists in the database from ${interaction.user.username}`);
                        await interaction.reply({ embeds: [await createEmbed(client, `${interaction.user}, url ${url} already exists`)], ephemeral: true });
                        return;
                    }
                    logger.info(`Adding url ${url} to the database from ${interaction.user.username}`);
                    await database.createUrls({url: url, userID: interaction.user.id});
                    await interaction.reply({ embeds: [await createEmbed(client, `${interaction.user}, url ${url} added successfully`)], ephemeral: true });
                } else {
                    logger.warning(`User ${interaction.user.username} (${interaction.user.id}) does not have the required role to add a url checker`);
                    await interaction.reply({ embeds: [await createEmbed(client, 'You do not have permission to use this command')], ephemeral: true });
                }
            } catch (error) {
                logger.error(`Error executing command 'addurlchecker': ${error.message}`);
                await interaction.reply({ embeds: [await createEmbed(client, 'An error occurred while executing the command')], ephemeral: true });
            }
        }

        if (cmd === 'removeurlchecker') {
            try {
                if (interaction.member.roles.cache.has(config.Client.Role.urlchecker_moderator)) {
                    const url = interaction.options.getString('url');
                    if (!(await database.getUrls({url: url}))) {
                        logger.info(`Url ${url} does not exist in the database from ${interaction.user.username}`);
                        await interaction.reply({ embeds: [await createEmbed(client, `${interaction.user}, url ${url} does not exist`)], ephemeral: true });
                        return;
                    }
                    logger.info(`Removing url ${url} from the database by ${interaction.user.username} (${interaction.user.id})`);
                    await database.removeUrls({url: url});
                    await interaction.reply({ embeds: [await createEmbed(client, `${interaction.user}, url ${url} removed successfully`)], ephemeral: true });
                } else {
                    logger.warning(`User ${interaction.user.username} (${interaction.user.id}) does not have the required role to remove a url checker`);
                    await interaction.reply({ embeds: [await createEmbed(client, 'You do not have permission to use this command')], ephemeral: true });
                }
            } catch (error) {
                logger.error(`Error executing command 'removeurlchecker': ${error.message}`);
                await interaction.reply({ embeds: [await createEmbed(client, 'An error occurred while executing the command')], ephemeral: true });
            }
        }
    });
}
