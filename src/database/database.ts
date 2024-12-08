import * as sqlite3 from "sqlite3";
import { TicketCreateInterface, TicketGetInterface, TicketGetFromTicketIDInterface, URLCreateInterface, URLGetInterface, URLRemoveInterface, MessageCreateInterface } from "./database.interface";
import { Logger } from "@/modules/logger/Logger";
import * as dotenv from "dotenv";

const logger = new Logger("logs/database/database.log");

class Database {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database('database.db', (err) => {
            if (err) {
                logger.error(`Error creating database: ${err}`);
            }
            this.init();
            logger.info("Database is ready");
        });
    }

    public init() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID TEXT NOT NULL UNIQUE,
                ticketID TEXT NOT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                status TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `;

        const createTableQueryHistory = `
            CREATE TABLE IF NOT EXISTS ticketsHistory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID TEXT NOT NULL,
                ticketID TEXT NOT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                status TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `;

        const createTableQueryURLS = `
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL UNIQUE,
                createdAt DATETIME NOT NULL,
                userID TEXT NOT NULL
            )
        `;

        const createTableQueryMessage = `
            CREATE TABLE IF NOT EXISTS message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channelId TEXT NOT NULL UNIQUE,
                messageId TEXT NOT NULL
            )
        `;
        this.db.run(createTableQuery, (err) => {
            if (err) {
                logger.error(`Error creating table: ${err}`);
            } else {
                logger.info("Table 'tickets' is ready.");
            }
        });
        this.db.run(createTableQueryHistory, (err) => {
            if (err) {
                logger.error(`Error creating table: ${err}`);
            } else {
                logger.info("Table 'ticketsHistory' is ready.");
            }
        });
        this.db.run(createTableQueryURLS, (err) => {
            if (err) {
                logger.error(`Error creating table: ${err}`);
            } else {
                logger.info("Table 'checkURLS' is ready.");
            }
        });
        this.db.run(createTableQueryMessage, (err) => {
            if (err) {
                logger.error(`Error creating table: ${err}`);
            } else {
                logger.info("Table 'message' is ready.");
            }
        });
    }

    public async createTicket(data: TicketCreateInterface) {
        const query = 'INSERT INTO tickets (userID, ticketID, createdAt, updatedAt, status, role) VALUES (?, ?, ?, ?, ?, ?)';
        this.db.run(query, [data.userID, data.ticketID, data.createdAt, data.updatedAt, data.status, data.role]);

        const queryHistory = 'INSERT INTO ticketsHistory (userID, ticketID, createdAt, updatedAt, status, role) VALUES (?, ?, ?, ?, ?, ?)';
        this.db.run(queryHistory, [data.userID, data.ticketID, data.createdAt, data.updatedAt, data.status, data.role]);
    }

    public async createUrls(data: URLCreateInterface) {
        const query = 'INSERT INTO urls (url, createdAt, userID) VALUES (?, ?, ?)';
        this.db.run(query, [data.url, new Date(), data.userID]);
    }
    
    public async createMessage(data: MessageCreateInterface) {
        const query = 'INSERT INTO message (channelId, messageId) VALUES (?, ?)';
        this.db.run(query, [data.channelId, data.messageId]);
    }

    public async removeUrls(data: URLRemoveInterface) {
        const query = 'DELETE FROM urls WHERE url = ?';
        this.db.run(query, [data.url]);
    }

    public async getUrls(data: URLGetInterface): Promise<any> {
        const query = 'SELECT * FROM urls WHERE url = ?';
        return new Promise((resolve, reject) => {
            this.db.get(query, [data.url], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public async getUrlsAll(): Promise<any> {
        const query = 'SELECT * FROM urls';
        return new Promise((resolve, reject) => {
            this.db.all(query, (err, rows) => { if (err) { reject(err); } else { resolve(rows); } });
        });
    }

    public async closeTicket(data: TicketGetInterface) {
        const updateQuery = 'UPDATE ticketsHistory SET status = ?, updatedAt = ? WHERE userID = ?';
        this.db.run(updateQuery, ["closed", new Date(), data.userID], (err) => {
            if (err) {
                logger.error(`Error updating ticket: ${err}`);
            } else {
                logger.info(`Ticket for userID ${data.userID} closed.`);
            }
        });

        const deleteQuery = 'DELETE FROM tickets WHERE userID = ?';
        this.db.run(deleteQuery, [data.userID], (err) => {
            if (err) {
                logger.error(`Error deleting ticket history: ${err}`);
            } else {
                logger.info(`Ticket history for userID ${data.userID} deleted.`);
            }
        });
    }

    public async getTicketUserID(data: TicketGetInterface): Promise<any> {
        const query = 'SELECT * FROM tickets WHERE userID = ?';
        return new Promise((resolve, reject) => {
            this.db.get(query, [data.userID], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public async getMessageByChannelId(channelId: string): Promise<any> {
        const query = 'SELECT * FROM message WHERE channelId = ?';
        return new Promise((resolve, reject) => {
            this.db.get(query, [channelId], (err, row) => { if (err) { reject(err); } else { resolve(row); } });
        });
    }

    public async getTicketTicketID(data: TicketGetFromTicketIDInterface): Promise<any> {
        const query = 'SELECT * FROM tickets WHERE ticketID = ?';
        return new Promise((resolve, reject) => {
            this.db.get(query, [data.ticketID], (err, row) => {
                if (err) { reject(err); } else { resolve(row); }
            });
        });
    }
}

export default Database;
