import { Controller, Get, Post, Delete, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { CategoryService } from 'src/services/category/category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: '카테고리 가져오기' })
  @Get()
  async getAllCategory() {
    const results = await this.categoryService.getAll();

    return Object.assign({
      message: `카테고리 전체 목록 가져오기`,
      results: results
    });
  }

  @ApiOperation({ summary: '새로운 카테고리 추가' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
  })
  @Post()
  async createCategory(@Body() data) {
    const success = await this.categoryService.create(data.name);


    return Object.assign({
      message:'새로운 카테고리 추가',
      success: success,
    });
  }


  @ApiOperation({ summary: '카테고리 수정 (인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newname: { type: 'string' },
        oldname: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCategory(@Body() data) {
    // TODO: 관리자용 (인증필요)
    const success = await this.categoryService.update(data.oldname, data.newname);

    return Object.assign({
      message: '카테고리 수정',
      success: success,
    });
  }

  
  @ApiOperation({ summary: '카테고리 삭제 (인증 필요)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCategory(@Body() data) {
    
    const success = await this.categoryService.delete(data.name);

    return Object.assign({
     message: '카테고리 삭제',
     success: success,
    });
  }
}
