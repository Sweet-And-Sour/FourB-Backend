import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from 'src/controllers/user/user.controller';
import { SignController } from 'src/controllers/sign/sign.controller';
import { ContentController } from 'src/controllers/content/content.controller';
import { FileController } from 'src/controllers/file/file.controller';
import { TeamController } from 'src/controllers/team/team.controller';
import { SearchController } from 'src/controllers/search/search.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { TagController } from 'src/controllers/tag/tag.controller';
import { TagService } from 'src/services/tag/tag.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    UserController,
    SignController,
    ContentController,
    FileController,
    TeamController,
    SearchController,
    TagController,
  ],
  providers: [AppService, TagService],
})
export class AppModule {}
