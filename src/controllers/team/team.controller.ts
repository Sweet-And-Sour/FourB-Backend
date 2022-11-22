import { Body, Controller, Delete, Patch, Post, Param, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamService } from 'src/services/team/team.service';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @ApiOperation({ summary: '팀 생성' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contents: { type: 'string' },
        introduction: { type: 'string' },
      },
    },
  })
  @Post()
  async createTeam(@Body() data) {
    console.log(data);

    const success = await this.teamService.create(data);

    return Object.assign({
      message: '팀 생성',
      success: success,
    });
  }

  @Get('/:id')
  readTeam(@Param('id') id: number): string {
    return `팀 정보 요청 (id: ${id})`;
  }

  @Patch('/:id')
  updateTeam(@Param('id') id: number): string {
    return `팀 정보 수정 (id: ${id})`;
  }

  @Delete('/:id')
  deleteTeam(@Param('id') id: number): string {
    return `팀 및 팀 데이터 삭제 (id: ${id})`;
  }
}
