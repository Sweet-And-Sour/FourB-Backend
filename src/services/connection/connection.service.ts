import { Injectable, Logger } from '@nestjs/common';
import { createPool, Connection, Pool } from 'mysql';

@Injectable()
export class ConnectionService {
  public pool: Pool;
  private readonly logger = new Logger(ConnectionService.name);

  constructor() {
    this.pool = createPool({
      host: process.env['DB_HOST'],
      user: process.env['DB_USER'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      connectionLimit: 10,
    });

    /*
     * [acquire]
     * acquire 이벤트는 pool에서 DB 연결을 획득한 경우 발생하며,
     * 연결 획득 작업이 완료된 이후 콜백 함수가 호출되기 전에 이벤트가 발생합니다.
     */
    this.pool.on('acquire', (connection: Connection) => {
      // TODO: Logger로 대체
      this.logger.log(`Connection ${connection.threadId} acquired`);
    });

    /*
     * [connection]
     * connection 이벤트는 pool안에서 새로운 DB 연결이 생성될 때 발생합니다.
     */
    this.pool.on('connection', (connection: Connection) => {
      // TODO: Logger로 대체
      this.logger.log(
        `New connection (${connection.threadId}) is mode within pool`,
      );
    });

    /*
     * [enqueue]
     * enqueue 이벤트는 사용가능한 DB 연결을 콜백함수 안에서 대기하기 위해 큐가 삽입되는 순간 발생합니다.
     */
    this.pool.on('enqueue', () => {
      // TODO: Logger로 대체
      this.logger.log('Waiting for available connection slot');
    });

    /*
     * [release]
     * release 이벤트는 DB 연결이 release(해제) 작업 완료 후 발생합니다.
     */
    this.pool.on('release', (connection: Connection) => {
      // TODO: Logger로 대체
      this.logger.log(`Connection ${connection.threadId} released`);
    });
  }
}
