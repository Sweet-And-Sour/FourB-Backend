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

  // async update(data: UserData) {
  //   if ((await this.getUser(data.username)) !== undefined) {
  //     this.logger.warn('UserService.update: the username is not exists');
  //     return false;
  //   }

  //   try {
  //     this.connectionService.pool.execute(
  //       'UPDATE Users SET email=?, password=? WHERE username=?',
  //       [data.email, data.password, data.username],
  //     );
  //   } catch (e) {
  //     return false;
  //   }

  //   return true;
  // }

  // async delete(username: string) {
  //   if ((await this.getUser(username)) !== undefined) {
  //     this.logger.warn('UserService.delete: the username is not exists');
  //     return false;
  //   }

  //   try {
  //     this.connectionService.pool.execute(
  //       'DELETE FROM Users WHERE username=?',
  //       [username],
  //     );
  //   } catch (e) {
  //     this.logger.error(e);
  //     return false;
  //   }

  //   return true;
  // }
}
