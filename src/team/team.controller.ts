import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('team')
export class TeamController {
  @Post()
  createTeam(): string {
    return '팀 생성';
  }

  @Get('/:id')
  readTeam(@Param('id') id: number): string {
    return `팀 정보 요청 (id: ${id})`;
  }

  @Put('/:id')
  updateTeam(@Param('id') id: number): string {
    return `팀 정보 수정 (id: ${id})`;
  }

  @Delete('/:id')
  deleteTeam(@Param('id') id: number): string {
    return `팀 및 팀 데이터 삭제 (id: ${id})`;
  }
}
