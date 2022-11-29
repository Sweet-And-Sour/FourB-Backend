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
import { FileService } from './services/file/file.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './services/auth/local.strategy';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
        rootPath: process.env['BACKEND_STATIC_FILES'],
        serveRoot: '/api/static',
      }),
    DatabaseModule,
    AuthModule
  ],
  controllers: [
    AppController,
    UserController,
    SignController,
    ContentController,
    FileController,
    TeamController,
    SearchController,
  ],
  providers: [AppService, FileService],
})
export class AppModule {}
