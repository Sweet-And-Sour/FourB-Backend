import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { TeamData } from 'src/interfaces/team-data.interface';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);
  constructor(private connectionService: ConnectionService) {}

  async read(id: number): Promise<any> {
    try {
      const [rows] = await this.connectionService.pool.execute('SELECT * FROM Teams WHERE id=?', [id]);

      if ((rows as any).length === 1) {
        return rows as any;
      } else {
        return undefined;
      }
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }

  async create(data: TeamData) {
    try {
      this.connectionService.pool.execute('INSERT INTO Teams (contents, introduction) VALUES (?, ?)', [
        data.contents,
        data.introduction,
      ]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async update(id: number, data: TeamData) {
    if ((await this.read(id)) === undefined) {
      this.logger.warn('TeamService.update: the id is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute('UPDATE Teams SET contents=?, introduction=? WHERE id=?', [
        data.contents,
        data.introduction,
        id,
      ]);
    } catch (e) {
      return false;
    }

    return true;
  }

  async delete(id: number) {
    if ((await this.read(id)) === undefined) {
      this.logger.warn('TeamService.delete: the id is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute('DELETE FROM Teams WHERE id=?', [id]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
