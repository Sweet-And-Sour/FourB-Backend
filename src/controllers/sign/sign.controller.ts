import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { LocalAuthGuard } from 'src/services/auth/local-auth.guard';

@ApiTags('Sign')
@Controller('sign')
export class SignController {
  constructor(private authService: AuthService) {}

  @Get()
  signOut() {
    return '로그아웃(인증 필요)';
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  signIn(@Request() req) {
    return this.authService.getToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payload')
  getPayload(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  @Post('/google')
  signInWithGoogleAccount() {
    return '구글 계정을 통한 로그인 (추가 개발)';
  }
}
