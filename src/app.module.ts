import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from 'src/controllers/user/user.controller';
import { SignController } from 'src/controllers/sign/sign.controller';
import { ContentController } from 'src/controllers/content/content.controller';
import { FileController } from 'src/controllers/file/file.controller';
import { TeamController } from 'src/controllers/team/team.controller';
import { SearchController } from 'src/controllers/search/search.controller';
import { CategoryController } from 'src/controllers/category/category.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CategoryService } from './services/category/category.service';
import { FileService } from './services/file/file.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import { ContentService } from './services/content/content.service';
import { TagController } from 'src/controllers/tag/tag.controller';
import { TagService } from 'src/services/tag/tag.service';
import { TeamService } from './services/team/team.service';
import { SearchService } from './services/search/search.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: process.env['BACKEND_STATIC_FILES'],
      serveRoot: '/api/static',
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    SignController,
    ContentController,
    FileController,
    TeamController,
    SearchController,
    CategoryController,
    TagController,
  ],
  providers: [
    AppService,
    TeamService,
    SearchService,
    CategoryService,
    FileService,
    ContentService,
    TagService,
  ],
})
export class AppModule {}
