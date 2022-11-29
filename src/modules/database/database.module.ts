import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { TeamService } from 'src/services/team/team.service';
import { ConnectionService } from 'src/services/connection/connection.service';

@Module({
  providers: [UserService, TeamService, ConnectionService],
  exports: [UserService, TeamService, ConnectionService],
})
export class DatabaseModule {}
