import { AppConfig } from "@/configs/app.config";
import { loadConfig } from "@/configs/app.config";
import { createEmbed } from "@/modules/discord/utils/embed";
import { ReplaceKeys, ThreadRoleRemove } from "@/bot/commands/Tickets/ticket.utils";



export async function ticketClose(client, interaction, database) {
    const config: AppConfig = await loadConfig()

    const ticket_channel = await database.getTicketTicketID({ ticketID: interaction.channelId });


    const userRoles = interaction.member.roles.cache;
    const requiredRoles: string[] = config.Client.Role.ticket_admin;

    const isBranchOwner = interaction.user.id === ticket_channel.userID;

    const hasRequiredRole = requiredRoles.some(role => userRoles.has(role));
    if (!hasRequiredRole && !isBranchOwner) {
        await interaction.reply({ content: 'Вы не можете это сделать', ephemeral: true });
        return false;
    }

    const closed_embed = await createEmbed(client, await ReplaceKeys(config.Thread.UI.Texts.ticket_close_message, {user: `<@${interaction.user.id}>`, createdAt: `<t:${ticket_channel.createdAt}>`, updatedAt: `<t:${ticket_channel.updatedAt}>`}));
    const thread = client.channels.cache.get(ticket_channel["ticketID"])

    if (thread) {
        await thread.members.remove(ticket_channel.userID);
        await database.closeTicket({ userID: ticket_channel.userID });
        await interaction.reply({ embeds: [closed_embed] });
        await thread.setName(`${thread.name}-archived`);
        await thread.setLocked(true);
        await thread.setArchived(true);
        await ThreadRoleRemove(thread);

        return true;
    }

    return false;

}
