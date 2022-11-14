import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  @Post()
  createContent(): string {
    return '새로운 컨텐츠 생성';
  }

  @Get('/:id')
  readContent(@Param('id') id: number): string {
    return `컨텐츠 요청 (id: ${id})`;
  }

  @Patch('/:id')
  updateContent(@Param('id') id: number): string {
    return `컨텐츠 내용 수정 (id: ${id})`;
  }

  @Delete('/:id')
  deleteContent(@Param('id') id: number): string {
    return `컨텐츠 삭제 (id: ${id})`;
  }
}
