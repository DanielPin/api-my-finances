import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { ILogin } from '../interfaces/login.interface';
import { IToken } from '../interfaces/token.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: ILogin): Promise<IToken> {
    return this.authService.validateUser(login);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('teste')
  public async teste(): Promise<string> {
    return 'teste guard and role';
  }
}
