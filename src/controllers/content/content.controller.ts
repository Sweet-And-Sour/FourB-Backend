import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { ContentService } from 'src/services/content/content.service';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private ContentService: ContentService) {}

  @ApiOperation({ summary: '컨텐츠 생성 (인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        title: { type: 'string' },
        contents: { type: 'string' },
        category: { type: 'string' },
        tags: { type: 'string' },
        thumbnail: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createContent(@Body() data) {
    const result = await this.ContentService.create(data);

    if (result === undefined) {
      return {
        message: '게시글 작성 실패',
        success: false,
      }
    }

    const contentId = result[0].insertId;

    return {
      message: '게시글 작성',
      success: true,
      contentId: contentId,
      url: `/view?id=${contentId}`,
    };
  }

  @ApiOperation({ summary: '모든 컨텐츠 요청' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호'
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: '정렬 방식'
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: '필터'
  })
  @Get('/all')
  async allContent(@Query() query) {
    if (query.page === undefined) {
      query.page = 0;
    }
    if (query.orderBy === undefined) {
      query.orderBy = 'created_datetime desc';
    }
    if (query.filter === undefined) {
      query.filter = {};
    } else {
      query.filter = JSON.parse(query.filter);
    }

    const result = await this.ContentService.getAll(query.page, query.orderBy, query.filter);

    return {
      message: '전체 게시글 불러오기',
      success: true,
      page: query.page,
      orderBy: query.orderBy,
      filter: query.filter,
      contents: result,
    };
  }

  @ApiOperation({ summary: '컨텐츠 요청' })
  @ApiParam({
    name: 'id',
  })
  @Get(':id')
  async readContent(@Param() params) {
    const result = await this.ContentService.read(params.id);

    if (result === undefined) {
      return {
        message: '게시글이 존재하지 않습니다',
        success: false,
      }
    }

    return {
      message: '게시글 불러오기',
      success: true,
      content: result,
    };
  }

  @ApiOperation({ summary: '컨텐츠 수정 (인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        contents: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateContent(@Body() data) {
    const success = await this.ContentService.update(data);

    return Object.assign({
      message: '게시글 수정',
      success: success,
    });
  }

  @ApiOperation({ summary: '컨텐츠 삭제 (인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteContent(@Body() data) {
    const success = await this.ContentService.delete(data);

    return Object.assign({
      message: '게시글 삭제',
      success: success,
    });
  }
}
