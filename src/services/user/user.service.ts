import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserData } from 'src/interfaces/user-data.interface';

@Injectable()
export class UserService {
  constructor(private connectionService: ConnectionService) {}

  async create(data: UserData) {
    this.connectionService.pool.getConnection((error, connection) => {
      if (error) throw error;

      const query = `INSERT INTO Users (username, password, email) VALUES ("${data.username}", "${data.password}", "${data.email}")`;
      connection.query(query, (error, results, fields) => {
        if (error) throw error;

        connection.release();
      });
    });
  }
}
