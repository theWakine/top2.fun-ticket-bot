import { Client, EmbedBuilder } from "discord.js";

export async function createEmbed(client: Client, description: string | undefined) {
    return new EmbedBuilder()
        .setDescription(description || '')
        .setFooter({ text: client.user?.username || '', iconURL: client.user?.displayAvatarURL() || '' })
        .setTimestamp()
        .setThumbnail(client.user?.displayAvatarURL() || '')
        .setColor(0xFF4473);
}