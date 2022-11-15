import { Controller, Get, Post, Delete, Patch, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  @Get()
  async getCategory() {
    return `카테고리 전체 목록 가져오기`;
  }

  @Post()
  async createCategory(@Body() data) {
    return '새로운 카테고리 추가';
  }


  @Patch()
  async updateCategory(@Body() data) {
    // TODO: 관리자용 (인증필요)
    return '카테고리 수정';
  }

  @Delete()
  async deleteCategory(@Body() data) {
    return '카테고리 삭제';
  }
}
