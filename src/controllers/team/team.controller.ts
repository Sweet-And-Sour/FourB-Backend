import { Body, Controller, Delete, Patch, Post, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { TeamService } from 'src/services/team/team.service';
import { UserService } from 'src/services/user/user.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    private userService: UserService,
    private teamService: TeamService
  ) {}

  @ApiOperation({ summary: '모든 팀 정보 요청' })
  @Get('/all')
  async getAllTeams() {
    const result = await this.teamService.getAllTeams();

    return {
      message: '모든 팀 정보 요청',
      success: true,
      teams: result,
    }
  }

  @ApiOperation({ summary: '특정 사용자가 맴버인 모든 팀 정보 요청' })
  @Get('/user/:username')
  async getMyTeams(@Param('username') username: string) {
    const users = await this.userService.getUser(username, "ALL");
    if (!users) {
      return {
        message: '사용자가 존재하지 않습니다',
        success: false,
      };
    }

    const result = await this.teamService.getMyTeams(users[0].id);

    return {
      message: '특정 사용자가 맴버인 모든 팀 정보 요청',
      username: username,
      success: true,
      teams: result || [],
    }
  }

  @ApiOperation({ summary: '팀 가입하기' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        teamname: { type: 'string' },
      },
    },
  })
  @Post('/join')
  async joinTeam(@Body() data) {
    const users = await this.userService.getUser(data.username, "ALL");
    if (!users) {
      return {
        message: '사용자가 존재하지 않습니다',
        success: false,
      };
    }

    const result = this.teamService.joinTeam(data.username, data.teamname);

    return {
      message: '팀 가입하기',
      success: result,
    }
  }

  @ApiOperation({ summary: '팀 정보 요청' })
  @Get('/:username')
  async getTeam(@Param('username') username: string) {
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
  async createTeam(@Body() data) {
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
  async updateTeam(@Body() data) {
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
  async deleteTeam(@Body() data) {
    const success = await this.userService.delete(data.username, "TEAM");

    return Object.assign({
      message: '팀 탈퇴',
      success: success,
    });
  }
}
