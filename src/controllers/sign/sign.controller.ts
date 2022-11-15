import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { LocalAuthGuard } from 'src/services/auth/local-auth.guard';

@ApiTags('Sign')
@Controller('sign')
export class SignController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post()
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.getToken(req.user);
  }

  @ApiOperation({ summary: 'JWT Payload 확인 (인증 필요)' })
  @Get('payload')
  @UseGuards(JwtAuthGuard)
  getPayload(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
