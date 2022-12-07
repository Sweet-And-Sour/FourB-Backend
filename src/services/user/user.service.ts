import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserData } from 'src/interfaces/user-data.interface';
import { ResetUserData } from 'src/interfaces/reset-user-data.interface';
import { generatePassword } from '../auth/constants';

@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name);
  private resetUsers: ResetUserData[] = [];

  constructor(private connectionService: ConnectionService) {}

  async getUser(username: string): Promise<any> {
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
    if ((await this.getUser(data.username)) === undefined) {
      this.logger.warn('UserService.update: the username is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute('UPDATE Users SET email=?, password=? WHERE username=?', [
        data.email,
        data.password,
        data.username,
      ]);
    } catch (e) {
      return false;
    }

    return true;
  }

  async delete(username: string) {
    if ((await this.getUser(username)) === undefined) {
      this.logger.warn('UserService.delete: the username is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute('DELETE FROM Users WHERE username=?', [username]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async createResetToken(username: string) {
    const user = await this.getUser(username);
    if (user === undefined) {
      this.logger.warn('UserService.createResetToken: the username is not exists');
      return false;
    }

    this.resetUsers.forEach((user: ResetUserData, index: number) => {
      if (user.username === username) {
        this.resetUsers[index].expired = true;
      }
    });

    const userData = (user as any)[0];

    const resetUserData: ResetUserData = {
      username: userData.username,
      email: userData.email,
      token: generatePassword(128),
      expired: false,
      createdDatetime: new Date(),
    }

    this.logger.log(`UserService.createResetToken: Created new token! (${username})`);

    this.resetUsers.push(resetUserData);

    console.log(this.resetUsers);
    return resetUserData;
  }

  async sendResetEmail(resetUset: ResetUserData) {
    
  }
}
