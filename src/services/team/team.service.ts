
import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(private connectionService: ConnectionService) {}

  async getMyTeams(user_id: number) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT team_id FROM TeamMembers WHERE user_id=? GROUP BY team_id',
        [user_id]
      );

      console.log(rows);

      if ((rows as any).length === 0) {
        return undefined;
      }

      return rows;

    } catch (e) {
      this.logger.error(e);
      console.error(e);
    }

    return undefined;
  }
  
  async joinTeam(username: string, teamname: string) {
    try {
      await this.connectionService.pool.execute(
        'INSERT INTO TeamMembers (team_id, user_id) VALUES (?, ?)',
        [username, teamname]
      );

      return true;

    } catch (e) {
      this.logger.error(e);
      console.error(e);

      return false;
    }
  }

  async getAllTeams() {
    try {
      const [rows] = await this.connectionService.pool.execute(
        `SELECT * FROM Users WHERE type='team'`,
        []
      );

      if ((rows as any).length === 0) {
        return undefined;
      }

      return rows;

    } catch (e) {
      this.logger.error(e);
      console.error(e);
    }

    return undefined;
  }
}
