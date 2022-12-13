import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentData } from 'src/interfaces/comment-data.interface';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth-guard';
import { CommentService } from 'src/services/comment/comment.service';
import { ContentService } from 'src/services/content/content.service';
import { UserService } from 'src/services/user/user.service';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private contentService: ContentService,
    private userService: UserService
  ) {}

  @ApiOperation({ summary: '댓글 추가' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        content_id: { type: 'number' },
        contents: { type: 'string' },
      },
    }
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body() data) {
    const users = await this.userService.getUser(data.username, "USER");
    const contents = await this.contentService.read(data.content_id);

    if (users === undefined) {
      return {
        message: 'username에 해당하는 사용자가 존재하지 않습니다.',
        success: false,
      };
    } else if (contents === undefined) {
      return {
        message: 'content_id에 해당하는 게시물이 존재하지 않습니다.',
        success: false,
      }
    }

    const result = await this.commentService.create({
      user_id: users[0].id,
      content_id: data.content_id,
      contents: data.contents
    } as CommentData);

    return {
      message: '댓글 추가',
      success: true,
    }
  }

  @ApiOperation({ summary: '게시글 댓글 모두 가져오기' })
  @Get('/:contend_id')
  async readComment(@Param('content_id') content_id: number) {
    const result = this.commentService.getAllComments(content_id);

    return {
      message: '게시글 댓글 모두 가져오기',
      success: true,
      comments: result,
    }
  }

  @ApiOperation({ summary: '댓글 삭제' })
  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComment(@Param('id') id: number) {
    if (!(await this.commentService.isExist(id))) {
      return {
        message: '댓글이 존재하지 않습니다',
        success: false,
      }
    }

    const result = await this.commentService.delete(id);

    return {
      message: '댓글 삭제',
      success: true,
    }
  }
}
