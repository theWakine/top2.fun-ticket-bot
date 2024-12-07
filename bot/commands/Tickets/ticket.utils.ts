import { User } from "discord.js";
import { AppConfig } from "../../../configs/app.config";
import { loadConfig } from "../../../configs/app.config";
import { Logger } from "../../../src/modules/logger/Logger";

let config: AppConfig;
const logger = new Logger("logs/bot/utils/ticket.log");

async function initializeConfig() {
    config = await loadConfig();
}

export async function ReplaceKeys(text: string, keys: Record<string, string>) {
    return text.replace(/{{([^}}]+)}}/g, (match, p1) => keys[p1] || match);
}

export async function ThreadRoleAdd(interaction, thread, addRole: string) {
    if (!config) {
        await initializeConfig();
    }
    const roles = Array.isArray(addRole) ? addRole.map(roleId => interaction.guild?.roles.cache.get(roleId)) : [interaction.guild?.roles.cache.get(addRole)];
    
    for (const role of roles) {
        if (role) {
            await role.guild.members.fetch();
            logger.info(`Role found: ${role.name} with ${role.members.size} members.`);
            if (role.members.size > 0) {
                for (const member of role.members.values()) {
                    try {
                        await thread.members.add(member.id);
                        logger.info(`Added member ${member.id} to thread ${thread.id}`);
                    } catch (error) {
                        logger.error(`Failed to add member ${member.id} to thread ${thread.id}: ${(error as Error).message}`);
                    }
                }
            } else {
                logger.warning("Role found but no members in the role.");
            }
        } else {
            logger.error("Role not found for add.");
        }
    }
}

export async function ThreadRoleRemove(thread) {
    if (!config) {
        await initializeConfig();
    }
    try {
        const members = await thread.members.fetch();
        for (const member of members.values()) {
            try {
                await thread.members.remove(member.id);
                logger.info(`Removed member ${member.id} from thread ${thread.id}`);
            } catch (error) {
                logger.error(`Failed to remove member ${member.id} from thread ${thread.id}: ${error.message}`);
            }
        }
    } catch (error) {
        logger.error(`Failed to fetch members for thread ${thread.id}: ${error.message}`);
    }
}
