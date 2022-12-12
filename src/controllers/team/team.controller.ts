import { Body, Controller, Delete, Patch, Post, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { UserService } from 'src/services/user/user.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '팀 정보 요청' })
  @Get('/:username')
  async getUser(@Param('username') username: string) {
    const results = await this.userService.getUser(username, "TEAM") as any;

    if (results === undefined) {
      return {
        message: '팀 정보가 존재하지 않습니다',
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
      message: '팀 정보 요청',
      success: true,
      data: results,
    };
  }

  @ApiOperation({ summary: '팀 생성(인증 필요)' })
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
  @Post()
  async createUser(@Body() data) {
    const success = await this.userService.create(data, "TEAM");

    return Object.assign({
      message: '팀 생성',
      success: success,
    });
  }

  @ApiOperation({ summary: '팀 정보 수정(인증 필요)' })
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
    const success = await this.userService.update(data, "TEAM");

    return {
      message: '팀 정보 수정',
      success: success,
    };
  }

  @ApiOperation({ summary: '팀 탈퇴 및 팀 정보 삭제(인증 필요)' })
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
    const success = await this.userService.delete(data.username, "TEAM");

    return Object.assign({
      message: '팀 탈퇴',
      success: success,
    });
  }
}
