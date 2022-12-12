import { Injectable, Logger } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserData } from 'src/interfaces/user-data.interface';
import { ResetUserData } from 'src/interfaces/reset-user-data.interface';
import { generatePassword } from '../auth/constants';
import * as sendgridMail from '@sendgrid/mail';

@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name);
  private resetUsers: ResetUserData[] = [];

  constructor(private connectionService: ConnectionService) {}

  async getUserFromId(userId: number): Promise<any> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Users WHERE id=?',
        [userId],
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
      const properties = [
        'email',
        'password',
        'background',
        'avatar',
        'introduction',
        'site',
        'friends',
        'field'
      ];

      let query = ''
      let params = []

      for (const property of properties) {
        if (data[property]) {
          query += ` ${property}=?,`;
          params.push(data[property]);
        }
      }

      query = query.substring(0, query.length - 1);
      params.push(data.username);

      this.connectionService.pool.execute(
        `UPDATE Users SET${query} WHERE username=?`,
        params,
      );
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

    const token = generatePassword(128, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
    const base64Token = Buffer.from(token, "utf8").toString('base64');

    const resetUserData: ResetUserData = {
      username: userData.username,
      email: userData.email,
      password: '',
      token: base64Token,
      expired: false,
      createdDatetime: new Date(),
    }

    this.logger.log(`UserService.createResetToken: Created new token! (username: ${username})`);

    this.resetUsers.push(resetUserData);
    return resetUserData;
  }

  sendResetEmail(resetUser: ResetUserData) {
    const resetUrl = `${process.env['DOMAIN_NAME']}/reset?token=${resetUser.token}`;


    sendgridMail.setApiKey(process.env['SENDGRID_EMAIL_API_KEY']);

    const mail = {
      to: resetUser.email,
      from: process.env['SENDGRID_SENDER_EMAIL'],
      subject: '[FourB] Reset your password',
      text: `Password Reset Link: ${resetUrl}`,
      html: `
        <p>Hello ${resetUser.username}</p>
        <p>We will send you the password reset link you requested.</p>
        <p>Access with the following link: <a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>Thank you!</p>
        <p>from The Sweet Team.</p>
        <hr>
        <p>안녕하세요 ${resetUser.username}님</p>
        <p>귀하가 요청하신 패스워드 초기화 링크를 보내 드립니다.</p>
        <p>다음 링크로 접속 하세요: <a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>감사합니다!</p>
        <br />
        <p>The Sweet Team 보냄.</p>
        `,
    };
    
    sendgridMail
      .send(mail)
      .then(() => {
        this.logger.log('UserService.sendResetEmail: Send password reset email with SendGrid');
      })
      .catch((error) => {
        console.error(error)
      });
  }

  async resetPassword(user: ResetUserData) {
    let isRight = false;

    for (const resetUser of this.resetUsers) {
      if (resetUser.token === user.token && !resetUser.expired && resetUser.username === user.username) {
        isRight = true;
        resetUser.expired = true;
        break;
      }
    }

    if (!isRight) {
      return false;
    }

    const updatedUser = (await this.getUser(user.username) as any)[0] as UserData;
    updatedUser.password = user.password;

    await this.update(updatedUser);

    this.logger.log(`UserService.sendResetEmail: The user password is changed! (username: ${user.username})`);
    return true;
  }
}
