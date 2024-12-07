


export interface TicketCreateInterface {
    userID: string;
    ticketID: string;
    status: "open" | "closed";
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketGetInterface {
    userID: string;
}

export interface TicketGetFromTicketIDInterface {
    ticketID: string;
}

export interface URLCreateInterface {
    url: string;
    userID: string;
}

export interface URLRemoveInterface {
    url: string;
}

export interface URLGetInterface {
    url: string;
}
