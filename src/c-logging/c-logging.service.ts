import { Injectable, ConsoleLogger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class CLoggingService extends ConsoleLogger {
  private readonly logsDir = path.join(__dirname, '..', '..', 'logs');

  private getTodayFileName(): string {
    return (
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Brussels',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .format(new Date())
        .replaceAll('/', '-') + '.log'
    );
  }

  private getTimestmp(): string {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Brussels',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  }

  private async ensureLogsDir(): Promise<void> {
    await fs.mkdir(this.logsDir, { recursive: true });
  }

  private async logToFile(entry: string): Promise<void> {
    try {
      await this.ensureLogsDir();

      const filePath = path.join(this.logsDir, this.getTodayFileName());
      const line = `${this.getTimestmp()}\t${entry}\n`;

      await fs.appendFile(filePath, line, 'utf8');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Logging error:', error.message);
      }
    }
  }

  log(message: any, context?: string) {
    const entry = `${context ?? 'App'}\t${message}`;
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext ?? 'Error'}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}