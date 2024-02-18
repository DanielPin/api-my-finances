import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/entity/user.entity';
import { UserService } from '@user/services/user.service';
import * as bcrypt from 'bcrypt';
import { ILogin } from '../interfaces/login.interface';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(dataLogin: ILogin): Promise<IToken> {
    try {
      const user: User = await this.userService.getUser(dataLogin.login);
      const isMatch: boolean = await bcrypt.compare(
        dataLogin.password,
        user.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Invalid login or password');
      }

      return this.jwtToken(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async jwtToken(user: User): Promise<IToken> {
    const payload = {
      username: user.fullName,
      sub: user.fullName,
      roles: user.role,
    };
    const token: string = await this.jwtService.signAsync(payload);
    const { exp } = await this.jwtService.verifyAsync(token, {
      publicKey: this.configService
        .get<string>('PUBLIC_KEY')
        .split(String.raw`\n`)
        .join('\n'),
    });
    const expiresIn: Date = new Date(0);

    expiresIn.setUTCSeconds(exp - 10800);

    return { token, expiresIn: expiresIn.toISOString() };
  }
}
