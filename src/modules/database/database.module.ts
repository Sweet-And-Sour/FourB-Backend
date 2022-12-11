import { Module } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { UserService } from 'src/services/user/user.service';

@Module({
  providers: [UserService, ConnectionService],
  exports: [UserService, ConnectionService],
})
export class DatabaseModule {}
