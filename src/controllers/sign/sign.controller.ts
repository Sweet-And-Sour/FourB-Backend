import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { LocalAuthGuard } from 'src/services/auth/local-auth.guard';

@ApiTags('Sign')
@Controller('sign')
export class SignController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post()
  signIn(@Request() req) {
    return this.authService.getToken(req.user);
  }

  @ApiOperation({ summary: 'JWT Payload 확인 (인증 필요)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('payload')
  getPayload(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: '새로운 JWT 토큰 생성 (인증 필요)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  getRefreshToken(@Request() req) {
    return this.authService.getToken(req.user);
  }
}
