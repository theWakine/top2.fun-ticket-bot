import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function replaceButtonStyle(style: string): ButtonStyle {
    switch (style) {
        case 'success': return ButtonStyle.Success;
        case 'danger': return ButtonStyle.Danger;
        case 'primary': return ButtonStyle.Primary;
        case 'secondary': return ButtonStyle.Secondary;
        case 'link': return ButtonStyle.Link;
        case 'premium': return ButtonStyle.Premium;
        default: return ButtonStyle.Secondary;
    }
}

export async function createButton(customId: string, label: string, emoji: string, style: string): Promise<ButtonBuilder> {
    return new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setEmoji(emoji)
        .setStyle(replaceButtonStyle(style));
}


export async function RowBuilder(buttons: ButtonBuilder[]) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    buttons.forEach(button => row.addComponents(button));
    return row;
}