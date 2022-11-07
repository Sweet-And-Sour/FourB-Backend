import { Controller, Get } from '@nestjs/common';

@Controller('search')
export class SearchController {
  @Get('/users')
  searchUser(): string {
    return '유저 찾기';
  }

  @Get('/teams')
  searchTeam(): string {
    return '팀 찾기';
  }

  @Get('/files')
  searchFile(): string {
    return '파일 찾기';
  }

  @Get('/contents')
  searchContent(): string {
    return '컨텐츠 찾기';
  }
}
