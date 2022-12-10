import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from '../../services/search/search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @ApiOperation({ summary: '유저 검색' })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
    type: Number,
  })
  @Get('/users')
  async searchUsers(
    @Query('username') username: undefined | string = undefined,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const results = await this.searchService.searchUsers(
      (username = username),
      (page = page),
      (limit = limit),
    );

    return {
      message: '유저 검색',
      success: results !== undefined,
      results: results,
    };
  }

  @Get('/teams')
  searchTeam(): string {
    return '팀 찾기';
  }

  @Get('/contents')
  searchContent(): string {
    return '컨텐츠 찾기';
  }
}
