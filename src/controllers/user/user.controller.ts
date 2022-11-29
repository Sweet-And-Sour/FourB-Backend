import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { UserService } from 'src/services/user/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        // TODO: 회원가입에 필요한 항목 추가
      },
    },
  })
  @Post()
  async createUser(@Body() data) {
    const success = await this.userService.create(data);

    return Object.assign({
      message: '회원 가입',
      success: success,
    });
  }

  @ApiOperation({ summary: '유저 정보 수정(인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(@Body() data) {
    const success = await this.userService.update(data);

    return Object.assign({
      message: '회원 정보 수정',
      success: success,
    });
  }

  @ApiOperation({ summary: '회원 탈퇴 및 회원 정보 삭제(인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Body() data) {
    const success = await this.userService.delete(data.username);

    return Object.assign({
      message: '회원 탈퇴',
      success: success,
    });
  }
}
