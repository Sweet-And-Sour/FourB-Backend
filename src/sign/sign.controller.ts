import { Controller, Get, Post } from '@nestjs/common';

@Controller('sign')
export class SignController {
  @Get()
  signOut(): string {
    return '로그아웃(인증 필요)';
  }

  @Post()
  signIn(): string {
    return '로그인';
  }

  @Post('/google')
  signInWithGoogleAccount(): string {
    return '구글 계정을 통한 로그인 (추가 개발)';
  }
}
