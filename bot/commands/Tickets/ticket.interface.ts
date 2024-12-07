


export interface TicketInterface {
    user: UserInterface;
    channel: ChannelInterface;
}

export interface UserInterface {
    id: string;
    username: string;
    avatar: string | null;
    tag: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface ChannelInterface {
    id: string;
    userId: string;
    channelId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    status: "open" | "closed";
}
