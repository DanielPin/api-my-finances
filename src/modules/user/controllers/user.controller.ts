import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@auth/enums/role.enum';
import { AuthGuard } from '@auth/guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async listUsers(): Promise<UserDTO[]> {
    const users: UserDTO[] = await this.userService.listUsers();
    return users;
  }

  @Get(':name')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(@Param() params: any): Promise<UserDTO> {
    const user: User = await this.userService.getUser(params.name);
    const userDTO: UserDTO = new UserDTO(user);
    return userDTO;
  }

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)  
  async createUser(@Body() user: User): Promise<UserDTO> {
    return this.userService.createUser(user);
  }
}
