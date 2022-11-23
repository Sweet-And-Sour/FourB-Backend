import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from 'src/services/file/file.service';
import { Response as Res } from 'express';

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

  @ApiOperation({ summary: '파일 다운로드' })
  @Get('/:filename')
  async getFile(@Response() response: Res, @Param('filename') filename: string) {
    const result = await this.fileService.streamFile(filename);

    if (result.success) {
      response.setHeader('Content-Type', result.mime);
      response.setHeader('Content-Disposition', `attachment; filename=${result.originalname}`);
      result.stream.pipe(response);

      return response;

    } else {
      return response.json(result);
    }
  }

  @ApiOperation({ summary: '파일 삭제 (인증 필요)' })
  @Delete('/:filename')
  async deleteFile(@Param('filename') filename: string) {
    return await this.fileService.deleteFile(filename);
  }
}
