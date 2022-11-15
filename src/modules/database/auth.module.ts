import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/services/auth/auth.service';
import { jwtConstants } from 'src/services/auth/constants';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { LocalStrategy } from 'src/services/auth/local.strategy';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
