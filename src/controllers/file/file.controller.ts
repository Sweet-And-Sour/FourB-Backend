import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from 'src/services/file/file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiOperation({ summary: '새로운 파일 추가 (인증 필요)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createFile(@UploadedFile('file') file: Express.Multer.File) {
    return this.fileService.createFile(file);
  }

  @Get('/:filename')
  readFile(@Param('filename') filename: string) {
    return '파일 요청';
  }

  @Delete('/:filename')
  deleteFile(@Param('filename') filename: string) {
    return this.fileService.deleteFile(filename);
  }
}
