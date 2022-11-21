import { Controller, Get, Post, Delete, Patch, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from 'src/services/tag/tag.service';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @ApiOperation({ summary: '태그 가져오기' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       tagname: { type: 'string' },
  //     },
  //   },
  // })

  @Get()
  async getAllTag() {
      const results = await this.tagService.getAll();

    return Object.assign({
      message: `태그 전체 목록 가져오기`,
      results: results
    });
  }

  @ApiOperation({ summary: '새로운 태그 추가' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
  })
  @Post()
  async createTag(@Body() data) {
    const success = await this.tagService.create(data);


    return Object.assign({
      message:'새로운 태그 추가',
      success: success,
    });
  }


  @ApiOperation({ summary: '태그 수정' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newname: { type: 'string' },
        oldname: { type: 'string' },
      },
    },
  })
  @Patch()
  async updateTag(@Body() data) {
    // TODO: 관리자용 (인증필요)
    const success = await this.tagService.update(data.oldname, data.newname);

    return Object.assign({
      message: '태그 수정',
      success: success,
    });
  }

  
  @ApiOperation({ summary: '태그 삭제' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
  })
  @Delete()
  async deleteTag(@Body() data) {
    
    const success = await this.tagService.delete(data.name);

    return Object.assign({
     message: '태그 삭제',
     success: success,
    });
  }
}
