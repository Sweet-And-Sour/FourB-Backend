import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetUserData } from 'src/interfaces/reset-user-data.interface';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { UserService } from 'src/services/user/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '회원 정보 요청' })
  @Get('/:username')
  async getUser(@Param('username') username: string) {
    const results = await this.userService.getUser(username, "USER") as any;

    if (results === undefined) {
      return {
        message: '회원 정보가 존재하지 않습니다',
        success: false,
      }
    }

    const removeFields = [ 'id', 'password' ];

    for (let index = 0; index < results.length; index++) {
      for (const field of removeFields) {
        delete results[index][field];
      }
    }

    return {
      message: '회원 정보 요청',
      success: true,
      data: results,
    };
  }

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
    const success = await this.userService.create(data, "USER");

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
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        background: { type: 'string' },
        avatar: { type: 'string' },
        introduction: { type: 'string' },
        site: { type: 'string' },
        friends: { type: 'string' },
        field: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(@Body() data) {
    const success = await this.userService.update(data, "USER");

    return {
      message: '회원 정보 수정',
      success: success,
    };
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
    const success = await this.userService.delete(data.username, "USER");

    return Object.assign({
      message: '회원 탈퇴',
      success: success,
    });
  }

  @ApiOperation({ summary: '사용자 패스워드 초기화 요청' })
  @Get('/reset/:username')
  async createResetLink(@Param('username') username: string) {
    const result = await this.userService.createResetToken(username, "USER");

    if (result) {
      this.userService.sendResetEmail(result);

      return {
        message: '패스워드 초기화 이메일을 전송했습니다',
        success: true,
      }
    }
    
    return {
      message: '패스워드 초기화 요청에 실패 했습니다 (username을 확인하세요)',
      success: false,
    }
  }

  @ApiOperation({ summary: '사용자 패스워드 초기화' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Post('/reset')
  async resetPassword(@Body() data) {
    const result = await this.userService.resetPassword(data, "USER");
  
    return {
      message: '패스워드 초기화',
      success: result,
    }
  }
}
