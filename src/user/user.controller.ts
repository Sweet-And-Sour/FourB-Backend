import { Controller, Delete, Post, Put } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post()
  createUser(): string {
    return '회원 가입';
  }

  @Put()
  updateUser(): string {
    return '유저 정보 수정(인증 필요)';
  }

  @Delete()
  deleteUser(): string {
    return '회워 탈퇴 및 회원 정보 삭제(인증 필요)';
  }
}
