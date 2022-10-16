import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { SignController } from './sign/sign.controller';
import { ContentController } from './content/content.controller';
import { FileController } from './file/file.controller';
import { TeamController } from './team/team.controller';
import { SearchController } from './search/search.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    SignController,
    ContentController,
    FileController,
    TeamController,
    SearchController,
  ],
  providers: [AppService],
})
export class AppModule {}
