import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  constructor(private connectionService: ConnectionService) {}

  async tagExist(tagname: string): Promise<boolean> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT name FROM Tags WHERE name=?',
        [tagname],
      );
  return (rows as any).length > 0;
    } catch (e) {
      this.logger.error(e);
    }

    return false;
  }

    async getAll(): Promise<any> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT name FROM Tags',
        [],
      );

      return rows;

    } catch (e) {
        console.error(e);
        this.logger.error(e);
        return undefined;
    }
  }

    async create(name: string) {
    try {
      this.connectionService.pool.execute(
        'INSERT INTO Tags (name) VALUES (?)',
        [name],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

   async update(oldname: string, newname: string) {
    if (!(await this.tagExist(oldname))) {
      this.logger.warn('TagService.update: the tagname is not exists');
      return false;
    }

   try {
      this.connectionService.pool.execute(
        'UPDATE Tags SET name=? WHERE name=?',
        [newname, oldname],
      );
       } catch (e) {
      return false;
    }

    return true;
  }

   async delete(tagname: string) {
    if (!(await this.tagExist(tagname))) {
      this.logger.warn('TagService.delete: the tagname is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute(
        'DELETE FROM Tags WHERE name=?',
        [tagname],
      );
    } catch (e) {
        console.error(e);
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
