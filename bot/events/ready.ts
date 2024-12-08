import { setupTicketSystem } from "@/bot/commands/Tickets/ticket";
import { Logger } from "@/modules/logger/Logger";
import Database from "@/database/database";
import { deployCommandsInit } from "@/bot/events/on/command/deploy.init";
import { deployCommands } from "@/bot/events/on/command/deploy";

const logger = new Logger('logs/app.log');

export default {
    name: 'ready',
    once: true,
    async execute(client: any) {
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        const database = new Database();
        await setupTicketSystem(client);
        await deployCommands(client);
        await deployCommandsInit(client);
    }
};