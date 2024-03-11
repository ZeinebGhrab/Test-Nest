import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcrypt';
import { User } from 'src/models/user.models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const matched = comparePassword(pass, user.password);
      if (matched) {
        console.log('User:', user);
        console.log('User Validation Succes !');
        return user;
      } else {
        console.log('Password do not match');
        return null;
      }
    }
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    };
    return {
      sub: user._id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
