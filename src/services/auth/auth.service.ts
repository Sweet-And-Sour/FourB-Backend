import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserData } from 'src/interfaces/user-data.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = (await this.userService.getUser(username))[0];

    if (user != undefined && user.password == password) {
      return user;
    }

    return undefined;
  }

  async getToken(user: UserData) {
    const payload = { username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
