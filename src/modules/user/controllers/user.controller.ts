import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@auth/enums/role.enum';
import { AuthGuard } from '@auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';
import { UserUpdateDTO } from '@user/dto/user-update.dto';
import { UserCreateDTO } from '@user/dto/user-create.dto';
import { UpdatePasswordDTO } from '@user/dto/update-password.dto';

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

  @Get('/details/:login')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('cpf') cpf: string): Promise<UserDTO> {
    const user: User = await this.userService.getUser(cpf);
    const userDTO: UserDTO = new UserDTO(user);
    return userDTO;
  }

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: UserCreateDTO): Promise<UserDTO> {
    return this.userService.createUser(user);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() user: UserUpdateDTO,
    @Request() req: any,
  ) {
    return this.userService.updateUser(id, user, req.user);
  }

  @Put('/update/password/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() password: UpdatePasswordDTO,
    @Request() req: any,
  ) {
    console.log('aaaaaaaaaaaaaaa', password)
    return this.userService.updatePassword(id, password, req.user);
  }

  @Delete('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: any): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
