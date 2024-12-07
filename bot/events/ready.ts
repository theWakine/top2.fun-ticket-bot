import { setupTicketSystem } from "../commands/Tickets/Ticket";
import { Logger } from "../../src/modules/logger/Logger";
import Database from "../../src/database/database";
import { deployCommandsInit } from "./on/command/deploy.init";
import { deployCommands } from "./on/command/deploy";

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