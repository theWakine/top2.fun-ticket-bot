import { Logger } from "@/modules/logger/Logger";
import { loadConfig, AppConfig } from "@/configs/app.config";
import { Interaction, TextChannel } from 'discord.js';
import { createButton, RowBuilder } from "@/modules/discord/utils/button";
import { createEmbed } from "@/modules/discord/utils/embed";
import { ticketOpen } from "@/bot/commands/Tickets/ticket.open";
import Database from "@/database/database";
import { ticketClose } from "@/bot/commands/Tickets/ticket.close";
const logger = new Logger("logs/bot/commands/ticket.log");

const database = new Database();

export async function setupTicketSystem(client: any) {
    const config: AppConfig = await loadConfig();
    const channel = await client.channels.fetch(config.Client.Guild.init_channel);
    
    const existingMessage = await database.getMessageByChannelId(channel.id);

    const embed_setup = await createEmbed(client, config.Thread.UI.Texts.init_embed_text);
    const button_setup = await createButton(
        config.Thread.UI.Buttons.open_ticket_button.customId,
        config.Thread.UI.Buttons.open_ticket_button.label,
        config.Thread.UI.Buttons.open_ticket_button.emoji,
        config.Thread.UI.Buttons.open_ticket_button.style
    );
    const button_report_setup = await createButton(
        config.Thread.UI.Buttons.report_open_button.customId,
        config.Thread.UI.Buttons.report_open_button.label,
        config.Thread.UI.Buttons.report_open_button.emoji,
        config.Thread.UI.Buttons.report_open_button.style
    );
    const button_admin_setup = await createButton(
        config.Thread.UI.Buttons.admin_open_button.customId,
        config.Thread.UI.Buttons.admin_open_button.label,
        config.Thread.UI.Buttons.admin_open_button.emoji,
        config.Thread.UI.Buttons.admin_open_button.style
    );

    if (existingMessage) {
        logger.info(`Ticket system already setup`);
    } else {
        logger.info(`Setting up ticket system...`);
        const message = await channel?.send({embeds: [embed_setup], components: [await RowBuilder([button_setup, button_report_setup, button_admin_setup])]});
        await database.createMessage({ channelId: channel.id, messageId: message.id });
    }

    try {
        client.on('interactionCreate', async (interaction: Interaction) => {
            if (interaction.isButton()) {
                if (interaction.customId === config.Thread.UI.Buttons.open_ticket_button.customId) {
                    try {
                        await ticketOpen(client, interaction, database, "ticket");
                    } catch (error) {
                        logger.error(error);
                        if (interaction.channel && interaction.channel instanceof TextChannel) {
                            await interaction.reply({ content: "Произошла ошибка при открытии тикета. Пожалуйста, попробуйте еще раз.", ephemeral: true });
                        }
                    }
                }

                if (interaction.customId === config.Thread.UI.Buttons.admin_open_button.customId) {
                    try {
                        await ticketOpen(client, interaction, database, "admin");
                    } catch (error) {
                        logger.error(error);
                        if (interaction.channel && interaction.channel instanceof TextChannel) {
                            await interaction.reply({ content: "Произошла ошибка при открытии тикета. Пожалуйста, попробуйте еще раз.", ephemeral: true });
                        }
                    }
                }

                if (interaction.customId === config.Thread.UI.Buttons.report_open_button.customId) {
                    try {
                        await ticketOpen(client, interaction, database, "report");
                    } catch (error) {
                        logger.error(error);
                        if (interaction.channel && interaction.channel instanceof TextChannel) {
                            await interaction.reply({ content: "Произошла ошибка при открытии тикета. Пожалуйста, попробуйте еще раз.", ephemeral: true });
                        }
                    }
                }

                if (interaction.customId === config.Thread.UI.Buttons.close_ticket_button.customId) {
                    await ticketClose(client, interaction, database);
                }
            }
        });
    } catch (error) {
        logger.error(`Ошибка при обработке взаимодействия: ${error}`);
    }
}

