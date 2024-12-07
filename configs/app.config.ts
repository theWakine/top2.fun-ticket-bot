import { ColorResolvable } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export function loadConfig(): AppConfig {
    try {
        const configPath = path.resolve(__dirname, 'app_config.json');
        const configFile = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(configFile) as AppConfig;
    } catch (error) {
        console.error('Error loading configuration:', error);
        throw error; // Re-throw the error after logging it
    }
}

const appConfig = loadConfig();

export interface AppConfig {
    Client: ClientConfig;
    Thread: ThreadConfig;
    OnEvents: OnEventsConfig;
}

interface ClientConfig {
    Guild: GuildConfig;
    Role: RoleConfig;
}

interface ThreadConfig {
    Types: Record<string, string>;
    Arguments: ThreadArgumentsConfig;
    UI: UIConfig;
    Categories: CategoriesConfig;
}

interface ThreadArgumentsConfig {
    auto_archive_duration: number;
    invitable: boolean;
    name_default: string;
    name_archived: string;
    reason: string;
    type: string;
}

interface UIConfig {
    Buttons: ButtonsConfig;
    Texts: TextsConfig;
}

interface ButtonsConfig {
    open_ticket_button: ButtonConfig;
    report_open_button: ButtonConfig;
    admin_open_button: ButtonConfig;
    close_ticket_button: ButtonConfig;
    disable_button: ButtonConfig;
}

interface ButtonConfig {
    label: string;
    emoji: string;
    style: string;
    disabled: boolean;
    customId: string;
}

interface CategoriesConfig {
    ticket: string;
    report: string;
    admin: string;
}

interface TextsConfig {
    init_embed_text: string;
    already_open_message: string;
    ticket_message: string;
    ticket_create_message: string;
    ticket_close_message: string;
    admin_ticket_message: string;
    report_ticket_message: string;
}

interface OnEventsConfig {
    check_message: CheckMessageConfig;
}

interface CheckMessageConfig {
    actived: boolean;
    urls: string[];
}

interface GuildConfig {
    id: string;
    init_channel: string;
}

interface RoleConfig {
    ticket_moderator: string[];
    admin_moderator: string[];
    report_moderator: string[];
    urlchecker_moderator: string;
}
