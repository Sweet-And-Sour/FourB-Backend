import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserData } from 'src/interfaces/user-data.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private connectionService: ConnectionService) {}

  async userExist(username: string): Promise<boolean> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT username FROM Users WHERE username=?',
        [username],
      );

      return (rows as any).length === 1;
    } catch (e) {
      this.logger.error(e);
    }

    return false;
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
    if (!(await this.userExist(data.username))) {
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
}
