import { Body,Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ContentsService } from 'src/services/content/content.service';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private ContentsService: ContentsService) {}
  
  @ApiOperation({ summary: '컨텐츠 생성' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        title: { type: 'string' },
        contents:{type:'string'},
        // TODO: 게시글 작성 항목 추가
      },
    },
  })
  @Post()
  async createContent(@Body() data) {
    const success = await this.ContentsService.create(data);

    return Object.assign({
      message: '게시글 작성',
      success: success,
    });
  }




  @ApiOperation({ summary: '컨텐츠 요청' })
  @ApiParam({
    name: 'id',
  })
  @Get(':id')
  async readContent(@Param() params) {
    const results = await this.ContentsService.read(params.id);

    return {
      message: '게시글 불러오기',
      success: results !== undefined,
      results: results,
    };
  }


  
  @ApiOperation({ summary: '컨텐츠 수정' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id:{type:'number'},
        contents: { type: 'string' },
      },
    },
  })
  @Patch()
  async updateContent(@Body() data) {
    const success = await this.ContentsService.update(data);

    return Object.assign({
      message: '게시글 수정',
      success: success,
    });
  }

  @ApiOperation({ summary: '컨텐츠 삭제' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },
  })
  @Delete()
  async deleteContent(@Body() data) {
    const success = await this.ContentsService.delete(data);

    return Object.assign({
      message: '게시글 삭제',
      success: success,
    });
  }
}
