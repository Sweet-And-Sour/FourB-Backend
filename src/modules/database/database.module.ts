import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { ConnectionService } from 'src/services/connection/connection.service';

@Module({
  providers: [UserService, ConnectionService],
  exports: [UserService],
})
export class DatabaseModule {}
