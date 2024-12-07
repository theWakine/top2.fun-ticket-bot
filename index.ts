import {Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
import readyEvent from "./bot/events/ready";
import { CheckMessageURL } from "./bot/events/on/CheckMessageURL/message";
import { Logger } from "./src/modules/logger/Logger";

const logger = new Logger('logs/app.log');

interface ExtendedClient extends Client {
    commands: Collection<string, any>;
}

dotenv.config();
const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
}) as ExtendedClient;

client.login(process.env.TOKEN);

try {
    client.on("ready", () => {
        readyEvent.execute(client);
    });
    logger.info("Ready event registered");

    client.on("messageCreate", async (message) => {
        await CheckMessageURL(message);
    });
} catch (error) {
    logger.error(`Error registering commands: ${error}`);
}




