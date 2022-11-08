import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserService } from 'src/services/user/user.service';

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
      },
    },
  })
  @Post()
  async createUser(@Body() data) {
    let success = true;

    try {
      await this.userService.create(data);
    } catch {
      success = false;
    }

    return Object.assign({
      message: '회원 가입',
      success: success,
    });
  }

  @ApiOperation({ summary: '유저 정보 수정(인증 필요)' })
  @Patch()
  updateUser(): string {
    return '유저 정보 수정(인증 필요)';
  }

  @ApiOperation({ summary: '회원 탈퇴 및 회원 정보 삭제(인증 필요)' })
  @Delete()
  deleteUser(): string {
    return '회원 탈퇴 및 회원 정보 삭제(인증 필요)';
  }
}
