import { Message } from "discord.js";
import { loadConfig } from "../../../../configs/app.config";
import Database from '../../../../src/database/database';

const database = new Database();
const config = loadConfig();

export async function CheckMessageURL(message: Message) {
    const denyURL = await database.getUrlsAll();
    // console.log(denyURL)

    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const urls = message.content.match(urlRegex);
    if (urls) {
        const isDenied = urls.some(url => denyURL.some(deny => url.includes(deny.url)));
        if (!config.OnEvents.check_message.actived) return;
        if (isDenied) {
            await message.delete();
        }
    }
}