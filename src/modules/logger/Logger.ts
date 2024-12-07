import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

export class Logger {
    private logFilePath: string;

    constructor(logFilePath: string) {
        this.logFilePath = logFilePath;
        this.ensureLogFilePath();
    }

    private ensureLogFilePath() {
        const dir = path.dirname(this.logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    private getCurrentTime(): string {
        const date = new Date();
        return date.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
    }

    private log(level: string, message: string) {
        let logMessage = `[${this.getCurrentTime()}] [${level.toUpperCase()}] ${message}`;
        
        switch (level) {
            case 'info':
                logMessage = chalk.green(logMessage);
                break;
            case 'critical':
                logMessage = chalk.bold.red(logMessage);
                break;
            case 'error':
                logMessage = chalk.red(logMessage);
                break;
            case 'warning':
                logMessage = chalk.yellow(logMessage);
                break;
        }

        console.log(logMessage);
        fs.appendFileSync(this.logFilePath, stripAnsi(logMessage) + '\n');
    }

    public error(message: string) {
        this.log('error', message);
    }

    public info(message: string) {
        this.log('info', message);
    }

    public warning(message: string) {
        this.log('warning', message);
    }

    public critical(message: string) {
        this.log('critical', message);
    }
}