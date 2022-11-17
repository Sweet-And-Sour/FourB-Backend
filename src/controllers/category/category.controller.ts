import { Controller, Get, Post, Delete, Patch, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/services/category/category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        // TODO: 회원가입에 필요한 항목 추가
      },
    },
  })
  
  @Get()
  async getCategory() {
      const success = await this.categoryService.get(data);

    return Object.assign({
      message: `카테고리 전체 목록 가져오기`,
      success: success
    });
  }

  @Post()
  async createCategory(@Body() data) {
    const success = await this.categoryService.create(data);


    return Object.assign({
      message:'새로운 카테고리 추가',
      success: success,
    });
  }


  @Patch()
  async updateCategory(@Body() data) {
    // TODO: 관리자용 (인증필요)
    const success = await this.categoryService.update(data);

    return Object.assign({
      message: '카테고리 수정',
      success: success,
    });
  }

  @Delete()
  async deleteCategory(@Body() data) {
    
    const success = await this.categoryService.delete(data.categoryname);

    return Object.assign({
     message: '카테고리 삭제',
     success: success,
    });
  }
}
