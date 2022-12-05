import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { Contentdata } from 'src/interfaces/content-data.interface';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  constructor(private connectionService: ConnectionService) {}

  async create(data: Contentdata) {
    try {
      this.connectionService.pool.execute(
        'INSERT INTO Contents ( user_id, title,contents) VALUES (?,?,?)',
        [data.user_id, data.title, data.contents],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async read(id: number) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Contents WHERE id=?',
        [id],
      );

      return rows;
    } catch (e) {
      this.logger.error(e);
      return undefined;
    }
  }

  async update(data: Contentdata) {
    try {
      this.connectionService.pool.execute('UPDATE Contents SET contents=? WHERE id=?', [
        data.contents,
        data.id,
      ]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async delete(data: Contentdata) {
    try {
      this.connectionService.pool.execute('DELETE FROM Contents WHERE id=?', [data.id]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
