import { Injectable, Logger } from '@nestjs/common';
import { CommentData } from 'src/interfaces/comment-data.interface';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {

  private readonly logger = new Logger(UserService.name);

  constructor(private connectionService: ConnectionService) {}

  async isExist(id: number) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Comments WHERE id=?',
        [id]
      );

      if ((rows as any).length === 0) {
        return false;
      }

      return true;

    } catch (e) {
      this.logger.error(e);
      console.error(e);
    }

    return false;
  }

  async create(data: CommentData) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        `INSERT INTO Comments (user_id, content_id, contents) VALUES (?, ?, ?)`,
        [
          data.user_id,
          data.content_id,
          data.contents
        ]
      );

      return rows;

    } catch (e) {
      this.logger.error(e);
      console.error(e);
    }

    return undefined;
  }

  async getAllComments(content_id: number) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        `SELECT
          Comments.id as id,
          Comments.user_id as user_id,
          Comments.content_id as content_id,
          Comments.contents as contents,
          Users.username as username,
          Users.avatar as avatar
        FROM Comments
        JOIN Users
        ON Comments.user_id=Users.id
        WHERE content_id=?`,
        [content_id]
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

  async delete(id: number) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'DELETE FROM Comments WHERE id=?',
        [id]
      );

      return rows;

    } catch (e) {
      this.logger.error(e);
      console.error(e);
    }

    return undefined;
  }
}
