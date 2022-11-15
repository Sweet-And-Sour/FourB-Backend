import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserData } from 'src/interfaces/user-data.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private connectionService: ConnectionService) {}

  async getUser(username: string): Promise<UserData> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Users WHERE username=?',
        [username],
      );

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

  async create(data: UserData) {
    try {
      this.connectionService.pool.execute(
        'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
        [data.username, data.password, data.email],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async update(data: UserData) {
    if (await this.getUser(data.username) !== undefined) {
      this.logger.warn('UserService.update: the username is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute(
        'UPDATE Users SET email=?, password=? WHERE username=?',
        [data.email, data.password, data.username],
      );
    } catch (e) {
      return false;
    }

    return true;
  }

  async delete(username: string) {
    if (await this.getUser(username) !== undefined) {
      this.logger.warn('UserService.delete: the username is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute(
        'DELETE FROM Users WHERE username=?',
        [username],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
