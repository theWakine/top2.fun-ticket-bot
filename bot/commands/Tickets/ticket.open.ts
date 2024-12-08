import { ButtonBuilder, ChannelType, TextChannel, ButtonStyle } from "discord.js";
import { Logger } from "@/modules/logger/Logger";
import { loadConfig, AppConfig } from "@/configs/app.config";
import { createEmbed } from "@/modules/discord/utils/embed";
import { ReplaceKeys, ThreadRoleAdd } from "@/bot/commands/Tickets/ticket.utils";
import { RowBuilder } from "@/modules/discord/utils/button";

export async function ticketOpen(client, interaction, database, category: string) {
    const logger = new Logger("logs/bot/commands/ticket.log");
    const config: AppConfig = await loadConfig();

    const ticket = await database.getTicketUserID({ userID: interaction.user.id });
    if (ticket) {
        const thread = client.channels.cache.get(ticket["ticketID"]);

        const error_ticket_create_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.already_open_message, {
            user: `<@${interaction.user.id}>`,
            existingTicket: `<#${ticket["ticketID"]}>`
        }));

        await interaction.reply({ embeds: [error_ticket_create_embed], ephemeral: true });
        return;
    } else {
        const textChannel = interaction.guild?.channels.cache.get(config.Client.Guild.init_channel);

        if (textChannel && textChannel.isTextBased()) {
            const textChannelAsText = textChannel as TextChannel;
            let moder_role: string[];
            if (category === "ticket") {
                category = config.Thread.Categories.ticket;
                moder_role = config.Client.Role.ticket_moderator;
            } else if (category === "report") {
                category = config.Thread.Categories.report;
                moder_role = config.Client.Role.report_moderator;
            } else if (category === "admin") {
                category = config.Thread.Categories.admin;
                moder_role = config.Client.Role.admin_moderator;
            } else {
                category = config.Thread.Categories.ticket;
                moder_role = [""];
            }

            const thread = await textChannelAsText.threads.create({
                name: await ReplaceKeys(config.Thread.Arguments.name_default, { user: interaction.user.username, category: category }),
                autoArchiveDuration: config.Thread.Arguments.auto_archive_duration,
                type: ChannelType.PrivateThread as any,
                reason: await ReplaceKeys(config.Thread.Arguments.reason, { user: `<@${interaction.user.id}>`, category: config.Thread.Categories.ticket })
            });
            thread.setLocked(true);
            const ticket_create_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.ticket_create_message, { user: `<@${interaction.user.id}>`, channel: `<#${thread.id}>` }));
            await interaction.reply({embeds: [ticket_create_embed], ephemeral: true});

            await thread.members.add(interaction.user.id);
            await ThreadRoleAdd(interaction, thread, moder_role);

            await database.createTicket({ userID: interaction.user.id, ticketID: thread.id, createdAt: new Date(), updatedAt: new Date(), status: "open", role: moder_role });

            const closeButton = new ButtonBuilder()
                .setCustomId(config.Thread.UI.Buttons.close_ticket_button.customId)
                .setLabel(config.Thread.UI.Buttons.close_ticket_button.label)
                .setStyle(ButtonStyle.Danger);
            let ticket_message_embed
            if (category === "ticket") {
                ticket_message_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.ticket_message, { user: `<@${interaction.user.id}>` }));
            } else if (category === "report") {
                ticket_message_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.report_ticket_message, { user: `<@${interaction.user.id}>` }));
            } else if (category === "admin") {
                ticket_message_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.admin_ticket_message, { user: `<@${interaction.user.id}>` }));
            }
            thread.setLocked(false);
            await thread.send({ embeds: [ticket_message_embed], components: [await RowBuilder([closeButton])] });

        } else {
            logger.error("Не удалось найти текстовый канал или канал не поддерживает треды.");
        }
    }
}
