import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private connectionService: ConnectionService) {}

  async searchUsers(
    username: undefined | string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    let usernameFilter = '';

    if (username !== undefined) {
      usernameFilter = `WHERE username LIKE '%${username}%' `;
    }

    if (page <= 0) page = 1;

    page = limit * (page - 1);

    try {
      const [rows] = await this.connectionService.pool.execute(
        `SELECT * FROM Users ${usernameFilter}ORDER BY username ASC LIMIT ${limit} OFFSET ${page}`,
      );

      if ((rows as any).length >= 1) {
        return rows as any;
      } else {
        return undefined;
      }
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }
}
