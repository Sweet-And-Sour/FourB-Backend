import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { ContentData } from 'src/interfaces/content-data.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  
  constructor (
    private connectionService: ConnectionService,
    private userService: UserService
  ) {}

  async create(data: ContentData) {
    const users: any = await this.userService.getUser(data.username);

    if (users === undefined || users.length === 0) {
      return false;
    }

    const user = users[0];

    try {
      const result = await this.connectionService.pool.execute(
        'INSERT INTO Contents (user_id, title, contents, category, tags) VALUES (?,?,?,?,?)',
        [
          user.id,
          data.title,
          data.contents,
          data.category,
          data.tags
        ],
      );

      return result;
      
    } catch (e) {
      console.error(e);
      this.logger.error(e);
      return undefined;
    }

    return undefined;
  }

  async read(id: number) {
    const [rows] = await this.connectionService.pool.execute('SELECT * FROM Contents WHERE id=?', [id]);

    if ((rows as any).length === 0) {
      return undefined;
    }

    const content = rows[0];
    const author = await this.userService.getUserFromId(content.user_id);

    content.username = author ? author[0].username : '';

    return content;
  }

  async update(data: ContentData) {
    try {
      this.connectionService.pool.execute('UPDATE Contents SET contents=? WHERE id=?', [data.contents, data.id]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async delete(data: ContentData) {
    try {
      this.connectionService.pool.execute('DELETE FROM Contents WHERE id=?', [data.id]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async getAll(page: number, orderBy: string) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        `SELECT * FROM Contents
        ORDER BY '${orderBy}' DESC
        LIMIT ${page * 10}, 10`,
        []
      );

      return rows;

    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }
}
