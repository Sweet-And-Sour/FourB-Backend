import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  @Post()
  createFile(): string {
    return '새로운 파일 추가';
  }

  @Get('/:hashId')
  readFile(@Param('hashId') hashId: number): string {
    return `파일 요청 (hashId: ${hashId})`;
  }

  @Delete('/:hashId')
  deleteFile(@Param('hashId') hashId: number): string {
    return `파일 삭제 (hashId: ${hashId})`;
  }
}
