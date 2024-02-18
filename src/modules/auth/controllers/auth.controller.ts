import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ILogin } from '../interfaces/login.interface';
import { IToken } from '../interfaces/token.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  public async login(@Body() login: ILogin): Promise<IToken> {
    return this.authService.validateUser(login);
  }
}
